import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function generateInventoryData() {
  const products = Array.from({ length: 50 }, (_, i) => `P${String(i + 1).padStart(4, '0')}`);
  const stores = Array.from({ length: 40 }, (_, i) => `S${String(i + 1).padStart(3, '0')}`);
  const categories = ['Groceries', 'Toys', 'Electronics', 'Furniture', 'Clothing'];
  const regions = ['North', 'South', 'East', 'West'];
  const weatherConditions = ['Sunny', 'Rainy', 'Cloudy', 'Snowy'];
  const seasonality = ['Spring', 'Summer', 'Autumn', 'Winter'];

  const data = [];
  const today = new Date();
  const recordsPerDay = 50;

  for (let dayOffset = 730; dayOffset >= 0; dayOffset--) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);
    const dateStr = date.toISOString().split('T')[0];
    const monthIndex = date.getMonth();

    for (let i = 0; i < recordsPerDay; i++) {
      const productId = products[Math.floor(Math.random() * products.length)];
      const storeId = stores[Math.floor(Math.random() * stores.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const region = regions[Math.floor(Math.random() * regions.length)];

      const baseUnits = Math.floor(Math.random() * 200) + 30;
      const variation = (Math.random() - 0.5) * 50;
      const unitsSold = Math.max(1, Math.floor(baseUnits + variation));

      const predictionError = (Math.random() - 0.5) * 20;
      const predictedUnitsSold = Math.max(1, Math.floor(unitsSold + predictionError));

      const basePrice = Math.random() * 150 + 5;
      const price = parseFloat(basePrice.toFixed(2));
      const discount = Math.random() > 0.75 ? Math.random() * 0.35 : 0;
      const revenue = unitsSold * price * (1 - discount);

      const inventoryLevel = Math.floor(Math.random() * 800) + 50;
      const unitsOrdered = Math.floor(unitsSold * (0.8 + Math.random() * 0.6));
      const stockMovement = unitsOrdered - unitsSold;
      const inventoryTurnover = inventoryLevel > 0 ? unitsSold / inventoryLevel : 0;

      const reorderAlert = inventoryLevel < 150;

      const seasonIndex = Math.floor(monthIndex / 3);
      const currentSeasonality = seasonality[seasonIndex];

      data.push({
        product_id: productId,
        store_id: storeId,
        date: dateStr,
        inventory_level: Math.round(inventoryLevel),
        units_sold: unitsSold,
        units_ordered: unitsOrdered,
        demand_forecast: Math.round(predictedUnitsSold * 1.08),
        predicted_units_sold: predictedUnitsSold,
        price: price,
        discount: parseFloat(discount.toFixed(2)),
        competitor_pricing: parseFloat((price * (Math.random() * 0.25 + 0.85)).toFixed(2)),
        revenue: parseFloat(revenue.toFixed(2)),
        stock_movement: stockMovement,
        inventory_turnover: parseFloat(inventoryTurnover.toFixed(4)),
        category: category,
        region: region,
        weather_condition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
        seasonality: currentSeasonality,
        holiday_promotion: Math.random() > 0.85,
        reorder_alert: reorderAlert,
      });
    }
  }

  return data;
}

async function seedDatabase() {
  console.log('Generating ~100,000 inventory records for 2 years of data...');
  const inventoryData = generateInventoryData();

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
        console.error(`✗ Batch ${batchNum}/${totalBatches} failed:`, error.message);
        errorCount += batch.length;
      } else {
        successCount += batch.length;
        const progress = ((i + batch.length) / inventoryData.length * 100).toFixed(1);
        console.log(`✓ Batch ${batchNum}/${totalBatches} complete (${progress}% done - ${successCount} records inserted)`);
      }
    } catch (err) {
      console.error(`✗ Batch ${batchNum}/${totalBatches} error:`, err.message);
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
  console.log('2. Explore the inventory with 100,000 records');
  console.log('3. View analytics and forecasts');
  console.log('4. Generate reports from 2 years of data');

  process.exit(errorCount > 0 ? 1 : 0);
}

seedDatabase().catch(err => {
  console.error('Fatal error during seeding:', err);
  process.exit(1);
});
