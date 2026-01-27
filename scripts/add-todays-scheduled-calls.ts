import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jytjdryjgcxgnfwlgtwc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dGpkcnlqZ2N4Z25md2xndHdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODYwNjAyNCwiZXhwIjoyMDg0MTgyMDI0fQ.H1c6S6DkhpZUqh6dOqwVUjnwZwtmf3_OsxNIR0ty9m0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addTodaysScheduledCalls() {
  console.log('📅 Adding today\'s scheduled calls for all 3 reps...\n');

  // First, get rep IDs
  const { data: reps, error: repsError } = await supabase
    .from('reps')
    .select('id, name');

  if (repsError || !reps) {
    console.error('❌ Error fetching reps:', repsError);
    return;
  }

  const sarahId = reps.find(r => r.name === 'Sarah Johnson')?.id;
  const tomId = reps.find(r => r.name === 'Tom Martinez')?.id;
  const emmaId = reps.find(r => r.name === 'Emma Rodriguez')?.id;

  if (!sarahId || !tomId || !emmaId) {
    console.error('❌ Could not find all reps');
    console.log('Available reps:', reps.map(r => r.name).join(', '));
    return;
  }

  console.log('✅ Found reps:');
  console.log(`   Sarah Johnson: ${sarahId}`);
  console.log(`   Tom Martinez: ${tomId}`);
  console.log(`   Emma Rodriguez: ${emmaId}\n`);

  // Get current time
  const now = new Date();

  console.log(`🕐 Current time (UTC): ${now.toISOString()}\n`);

  // Get tomorrow's date (since we want future scheduled calls)
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);

  // Helper function to create datetime for tomorrow
  // CST is UTC-6, so we add 6 hours to the desired CST time to get UTC
  const createCSTDateTime = (hour: number, minute: number = 0) => {
    const date = new Date(tomorrow);
    // Set the time in CST (which means UTC time is 6 hours ahead)
    date.setUTCHours(hour + 6, minute, 0, 0);
    return date.toISOString();
  };

  // Sarah Johnson's scheduled calls (3 calls)
  const sarahCalls = [
    {
      rep_id: sarahId,
      customer_name: 'Robert Martinez',
      company: 'DataFlow Systems',
      call_type: 'Discovery',
      scheduled_date: createCSTDateTime(10, 0), // 10:00 AM CST
      duration_minutes: 30,
      priority: 'high',
      notes: 'CEO of mid-size data analytics company. Interested in our enterprise solution. Hot lead from webinar.',
      linkedin_url: 'https://linkedin.com/in/robert-martinez',
      preparation_tips: [
        'Review their recent product launch announcement',
        'Prepare case study from similar data analytics company',
        'Have pricing tiers ready for 50-100 users'
      ]
    },
    {
      rep_id: sarahId,
      customer_name: 'Lisa Thompson',
      company: 'CloudTech Innovations',
      call_type: 'Demo',
      scheduled_date: createCSTDateTime(14, 0), // 2:00 PM CST
      duration_minutes: 45,
      priority: 'medium',
      notes: 'Follow-up demo after initial discovery call. Technical team will join. Focus on API integrations.',
      linkedin_url: 'https://linkedin.com/in/lisa-thompson',
      preparation_tips: [
        'Prepare API integration demo environment',
        'Review their tech stack (mentioned Python & AWS)',
        'Have technical specialist on standby'
      ]
    },
    {
      rep_id: sarahId,
      customer_name: 'James Wilson',
      company: 'FinanceHub Pro',
      call_type: 'Follow-up',
      scheduled_date: createCSTDateTime(16, 0), // 4:00 PM CST
      duration_minutes: 20,
      priority: 'low',
      notes: 'Check-in call after trial period. Gauge interest and address any concerns.',
      linkedin_url: 'https://linkedin.com/in/james-wilson',
      preparation_tips: [
        'Review their trial usage analytics',
        'Prepare renewal discount offer',
        'Ask about team feedback'
      ]
    }
  ];

  // Tom Martinez's scheduled calls (3 calls)
  const tomCalls = [
    {
      rep_id: tomId,
      customer_name: 'Amanda Foster',
      company: 'RetailMax Solutions',
      call_type: 'Discovery',
      scheduled_date: createCSTDateTime(9, 0), // 9:00 AM CST
      duration_minutes: 30,
      priority: 'high',
      notes: 'VP of Operations at large retail chain. Urgent need for inventory management solution.',
      linkedin_url: 'https://linkedin.com/in/amanda-foster',
      preparation_tips: [
        'Research their current inventory challenges',
        'Prepare retail-specific use cases',
        'Highlight real-time tracking features'
      ]
    },
    {
      rep_id: tomId,
      customer_name: 'Kevin Park',
      company: 'StartupLaunch Inc',
      call_type: 'Qualification',
      scheduled_date: createCSTDateTime(13, 0), // 1:00 PM CST
      duration_minutes: 25,
      priority: 'medium',
      notes: 'Early-stage startup founder. Budget-conscious but high growth potential.',
      linkedin_url: 'https://linkedin.com/in/kevin-park',
      preparation_tips: [
        'Prepare startup pricing tier',
        'Discuss scalability options',
        'Share success stories from similar startups'
      ]
    },
    {
      rep_id: tomId,
      customer_name: 'Michelle Rodriguez',
      company: 'HealthCare Plus',
      call_type: 'Demo',
      scheduled_date: createCSTDateTime(15, 0), // 3:00 PM CST
      duration_minutes: 40,
      priority: 'high',
      notes: 'Healthcare compliance officer. Needs HIPAA-compliant solution. Decision maker.',
      linkedin_url: 'https://linkedin.com/in/michelle-rodriguez',
      preparation_tips: [
        'Review HIPAA compliance documentation',
        'Prepare security & encryption demo',
        'Have compliance certifications ready'
      ]
    }
  ];

  // Emma Rodriguez's scheduled calls (3 calls)
  const emmaCalls = [
    {
      rep_id: emmaId,
      customer_name: 'Daniel Lee',
      company: 'TechVentures Global',
      call_type: 'Discovery',
      scheduled_date: createCSTDateTime(11, 0), // 11:00 AM CST
      duration_minutes: 30,
      priority: 'medium',
      notes: 'CTO of international tech company. Exploring solutions for remote team collaboration.',
      linkedin_url: 'https://linkedin.com/in/daniel-lee',
      preparation_tips: [
        'Highlight multi-timezone features',
        'Prepare international case studies',
        'Discuss multi-language support'
      ]
    },
    {
      rep_id: emmaId,
      customer_name: 'Patricia Chen',
      company: 'EduTech Academy',
      call_type: 'Follow-up',
      scheduled_date: createCSTDateTime(14, 30), // 2:30 PM CST
      duration_minutes: 20,
      priority: 'low',
      notes: 'Education sector lead. Following up on proposal sent last week.',
      linkedin_url: 'https://linkedin.com/in/patricia-chen',
      preparation_tips: [
        'Review proposal details',
        'Prepare education pricing discount',
        'Address any questions from proposal'
      ]
    },
    {
      rep_id: emmaId,
      customer_name: 'Steven Anderson',
      company: 'Manufacturing Pro',
      call_type: 'Demo',
      scheduled_date: createCSTDateTime(16, 30), // 4:30 PM CST
      duration_minutes: 45,
      priority: 'high',
      notes: 'Operations Director. Needs production tracking solution. Large deal potential ($100K+).',
      linkedin_url: 'https://linkedin.com/in/steven-anderson',
      preparation_tips: [
        'Prepare manufacturing-specific demo',
        'Show production analytics dashboard',
        'Discuss enterprise pricing and ROI'
      ]
    }
  ];

  const allCalls = [...sarahCalls, ...tomCalls, ...emmaCalls];

  // Create a mapping for rep names
  const repNames: Record<string, string> = {
    [sarahId]: 'Sarah Johnson',
    [tomId]: 'Tom Martinez',
    [emmaId]: 'Emma Rodriguez'
  };

  console.log(`📝 Inserting ${allCalls.length} scheduled calls...\n`);

  for (const call of allCalls) {
    const scheduledTime = new Date(call.scheduled_date);
    const repName = repNames[call.rep_id];
    console.log(`📞 ${repName} → ${call.customer_name}`);
    console.log(`   Company: ${call.company}`);
    console.log(`   Type: ${call.call_type} | Priority: ${call.priority}`);
    console.log(`   Time (CST): ${scheduledTime.toLocaleTimeString('en-US', { timeZone: 'America/Chicago', hour: '2-digit', minute: '2-digit', hour12: true })}`);
    console.log(`   Duration: ${call.duration_minutes} min`);

    const { error } = await supabase
      .from('scheduled_calls')
      .insert([call]);

    if (error) {
      console.error(`   ❌ Error:`, error.message);
    } else {
      console.log(`   ✅ Added successfully`);
    }
    console.log('');
  }

  console.log('🎉 Done! All scheduled calls added.');
}

addTodaysScheduledCalls();

