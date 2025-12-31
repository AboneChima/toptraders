const { PrismaClient } = require('@prisma/client');

// Old database connection
const oldDb = new PrismaClient({
  datasources: {
    db: {
      url: "postgres://9a60724e791d987fcc7a79bca9df0fde016ba3ded4c545e5c37f8c89ff526b1f:sk_BI10UOJ8E1XOoa1-dZczE@db.prisma.io:5432/postgres?sslmode=require"
    }
  }
});

// New database connection
const newDb = new PrismaClient({
  datasources: {
    db: {
      url: "postgres://3a8a243de819da548c410c55f7dde652a94134de222a09ac3dfbcca081187c94:sk_bR_2ryIwbyc8UyyMM1ymZ@db.prisma.io:5432/postgres?sslmode=require"
    }
  }
});

async function migrateData() {
  try {
    console.log('🔄 Starting data migration...\n');

    // Migrate Users
    console.log('📦 Migrating users...');
    const users = await oldDb.user.findMany();
    console.log(`Found ${users.length} users`);
    
    for (const user of users) {
      await newDb.user.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          balance: user.balance,
          status: user.status,
          createdAt: user.createdAt
        }
      });
    }
    console.log('✅ Users migrated\n');

    // Migrate Currency Pairs
    console.log('📦 Migrating currency pairs...');
    const currencyPairs = await oldDb.currencyPair.findMany();
    console.log(`Found ${currencyPairs.length} currency pairs`);
    
    for (const pair of currencyPairs) {
      await newDb.currencyPair.create({
        data: {
          id: pair.id,
          name: pair.name,
          category: pair.category,
          price: pair.price,
          change: pair.change,
          icon: pair.icon,
          description: pair.description,
          status: pair.status,
          updatedAt: pair.updatedAt
        }
      });
    }
    console.log('✅ Currency pairs migrated\n');

    // Migrate Trades
    console.log('📦 Migrating trades...');
    const trades = await oldDb.trade.findMany();
    console.log(`Found ${trades.length} trades`);
    
    for (const trade of trades) {
      await newDb.trade.create({
        data: {
          id: trade.id,
          userId: trade.userId,
          currencyPair: trade.currencyPair,
          type: trade.type,
          amount: trade.amount,
          entryPrice: trade.entryPrice,
          currentPrice: trade.currentPrice,
          profitLoss: trade.profitLoss,
          status: trade.status,
          createdAt: trade.createdAt,
          closedAt: trade.closedAt
        }
      });
    }
    console.log('✅ Trades migrated\n');

    // Migrate Deposits
    console.log('📦 Migrating deposits...');
    const deposits = await oldDb.deposit.findMany();
    console.log(`Found ${deposits.length} deposits`);
    
    for (const deposit of deposits) {
      await newDb.deposit.create({
        data: {
          id: deposit.id,
          userId: deposit.userId,
          amount: deposit.amount,
          method: deposit.method,
          status: deposit.status,
          transactionId: deposit.transactionId,
          createdAt: deposit.createdAt
        }
      });
    }
    console.log('✅ Deposits migrated\n');

    // Migrate Withdrawals
    console.log('📦 Migrating withdrawals...');
    const withdrawals = await oldDb.withdrawal.findMany();
    console.log(`Found ${withdrawals.length} withdrawals`);
    
    for (const withdrawal of withdrawals) {
      await newDb.withdrawal.create({
        data: {
          id: withdrawal.id,
          userId: withdrawal.userId,
          amount: withdrawal.amount,
          walletAddress: withdrawal.walletAddress,
          status: withdrawal.status,
          createdAt: withdrawal.createdAt
        }
      });
    }
    console.log('✅ Withdrawals migrated\n');

    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await oldDb.$disconnect();
    await newDb.$disconnect();
  }
}

migrateData()
  .catch(console.error);
