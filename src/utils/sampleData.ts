export const generateSampleInventoryData = () => {
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
};

export const generateSampleNotifications = (userId: string) => {
  const types = ['reorder', 'anomaly', 'forecast', 'system'];
  const notifications = [];

  for (let i = 0; i < 5; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const date = new Date();
    date.setHours(date.getHours() - i * 2);

    let title = '';
    let message = '';

    switch (type) {
      case 'reorder':
        title = 'Low Inventory Alert';
        message = `Product P00${i + 1} at Store S001 has reached reorder threshold. Current level: ${Math.floor(Math.random() * 50 + 100)} units.`;
        break;
      case 'anomaly':
        title = 'Sales Anomaly Detected';
        message = `Unusual sales pattern detected for Product P00${i + 1}. Actual sales exceeded forecast by ${(Math.random() * 30 + 10).toFixed(1)}%.`;
        break;
      case 'forecast':
        title = 'Demand Forecast Update';
        message = `Updated forecast shows ${Math.random() > 0.5 ? 'increased' : 'decreased'} demand for ${['Electronics', 'Clothing', 'Food'][i % 3]} category next week.`;
        break;
      case 'system':
        title = 'System Update';
        message = 'ML model has been retrained with latest data. Prediction accuracy improved by 2.3%.';
        break;
    }

    notifications.push({
      user_id: userId,
      type,
      title,
      message,
      read: Math.random() > 0.5,
      created_at: date.toISOString(),
    });
  }

  return notifications;
};
