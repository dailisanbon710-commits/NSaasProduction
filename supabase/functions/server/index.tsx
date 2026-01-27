import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-7fa4a1b1/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-7fa4a1b1/signup", async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password required" }, 400);
    }

    // Validate role
    if (role && !['rep', 'manager'].includes(role)) {
      return c.json({ error: "Invalid role. Must be 'rep' or 'manager'" }, 400);
    }

    // Check if user already exists
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (!listError) {
      const userExists = existingUsers?.users?.some((u: any) => u.email === email);
      if (userExists) {
        return c.json({ 
          error: "An account with this email already exists. Please sign in instead." 
        }, 409);
      }
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: role || 'rep' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.error("Sign up error:", error);
      
      // Handle duplicate email error specifically
      if (error.message?.includes('already been registered') || error.code === 'email_exists') {
        return c.json({ 
          error: "An account with this email already exists. Please sign in instead." 
        }, 409);
      }
      
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.error("Sign up error:", error);
    return c.json({ error: "Sign up failed" }, 500);
  }
});

// Sign in endpoint (handled by Supabase client directly)

// Verify auth middleware
const verifyAuth = async (c: any, next: any) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  
  if (!accessToken) {
    return c.json({ error: "Unauthorized - No token provided" }, 401);
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (error || !user) {
    console.error("Auth verification error:", error);
    return c.json({ error: "Unauthorized - Invalid token" }, 401);
  }

  c.set('userId', user.id);
  c.set('userEmail', user.email);
  await next();
};

// Generate unique share link
app.post("/make-server-7fa4a1b1/share/create", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const { sharedWithEmail, permission } = await c.req.json();

    if (!sharedWithEmail) {
      return c.json({ error: "sharedWithEmail required" }, 400);
    }

    // Generate unique share token
    const shareToken = crypto.randomUUID();
    
    // Store share permission
    const shareData = {
      ownerId: userId,
      sharedWithEmail,
      permission: permission || 'view', // 'view' or 'edit'
      createdAt: new Date().toISOString(),
      expiresAt: null, // Could add expiration
    };

    await kv.set(`share:${shareToken}`, shareData);
    
    // Also store by owner for easy retrieval
    const ownerShares = await kv.get(`shares:owner:${userId}`) || [];
    ownerShares.push({ shareToken, ...shareData });
    await kv.set(`shares:owner:${userId}`, ownerShares);

    const shareUrl = `${c.req.header('origin')}/dashboard/shared/${shareToken}`;
    
    return c.json({ 
      success: true, 
      shareToken, 
      shareUrl,
      sharedWithEmail,
    });
  } catch (error) {
    console.error("Share creation error:", error);
    return c.json({ error: "Failed to create share link" }, 500);
  }
});

// Verify share access
app.get("/make-server-7fa4a1b1/share/verify/:token", async (c) => {
  try {
    const shareToken = c.req.param('token');
    const userEmail = c.req.query('email');

    if (!shareToken) {
      return c.json({ error: "Share token required" }, 400);
    }

    const shareData = await kv.get(`share:${shareToken}`);
    
    if (!shareData) {
      return c.json({ error: "Invalid or expired share link" }, 404);
    }

    // Check if user email matches shared email
    if (userEmail && shareData.sharedWithEmail !== userEmail) {
      return c.json({ error: "Access denied - Wrong email" }, 403);
    }

    return c.json({ 
      success: true,
      permission: shareData.permission,
      ownerId: shareData.ownerId,
      sharedWithEmail: shareData.sharedWithEmail,
    });
  } catch (error) {
    console.error("Share verification error:", error);
    return c.json({ error: "Failed to verify share" }, 500);
  }
});

// Get all shares created by user
app.get("/make-server-7fa4a1b1/shares/my", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const shares = await kv.get(`shares:owner:${userId}`) || [];
    
    return c.json({ shares });
  } catch (error) {
    console.error("Get shares error:", error);
    return c.json({ error: "Failed to get shares" }, 500);
  }
});

// Revoke share access
app.delete("/make-server-7fa4a1b1/share/:token", verifyAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const shareToken = c.req.param('token');

    // Get share data to verify ownership
    const shareData = await kv.get(`share:${shareToken}`);
    
    if (!shareData || shareData.ownerId !== userId) {
      return c.json({ error: "Not authorized to revoke this share" }, 403);
    }

    // Delete share
    await kv.del(`share:${shareToken}`);
    
    // Remove from owner's list
    const ownerShares = await kv.get(`shares:owner:${userId}`) || [];
    const updatedShares = ownerShares.filter((s: any) => s.shareToken !== shareToken);
    await kv.set(`shares:owner:${userId}`, updatedShares);

    return c.json({ success: true });
  } catch (error) {
    console.error("Revoke share error:", error);
    return c.json({ error: "Failed to revoke share" }, 500);
  }
});

Deno.serve(app.fetch);