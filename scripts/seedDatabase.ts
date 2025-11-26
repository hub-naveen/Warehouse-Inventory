import { createClient } from '@supabase/supabase-js';
import { generateSampleInventoryData } from '../src/utils/sampleData';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedDatabase() {
  console.log('Generating ~100,000 inventory records for 2 years of data...');
  const inventoryData = generateSampleInventoryData();

  console.log(`Total records to insert: ${inventoryData.length}`);

  const batchSize = 1000;
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < inventoryData.length; i += batchSize) {
    const batch = inventoryData.slice(i, Math.min(i + batchSize, inventoryData.length));
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(inventoryData.length / batchSize);

    try {
      const { error } = await supabase
        .from('inventory_data')
        .insert(batch, { count: 'exact' });

      if (error) {
        console.error(`Batch ${batchNum}/${totalBatches} failed:`, error.message);
        errorCount += batch.length;
      } else {
        successCount += batch.length;
        const progress = ((i + batch.length) / inventoryData.length * 100).toFixed(1);
        console.log(`✓ Batch ${batchNum}/${totalBatches} complete (${progress}% done)`);
      }
    } catch (err) {
      console.error(`Batch ${batchNum}/${totalBatches} error:`, err);
      errorCount += batch.length;
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n=== Database Seeding Summary ===');
  console.log(`Total records generated: ${inventoryData.length}`);
  console.log(`Successfully inserted: ${successCount}`);
  console.log(`Failed insertions: ${errorCount}`);
  console.log('\nYou can now:');
  console.log('1. Sign up for a new account in the dashboard');
  console.log('2. Explore the inventory with ML predictions');
  console.log('3. View analytics and forecasts');
  console.log('4. Generate reports from 2 years of data');
}

seedDatabase().catch(err => {
  console.error('Fatal error during seeding:', err);
  process.exit(1);
});
