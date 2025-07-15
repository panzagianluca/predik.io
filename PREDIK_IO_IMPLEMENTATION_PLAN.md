# 🎯 Predik.io - Complete Implementation Plan

## 📋 **PROJECT SPECIFICATIONS CONFIRMED**

### **Core Requirements**
- **Pool-based pricing system** (simple and effective)
- **Paper trading only** - No real money involved
- **$10,000 starting balance** for all new users
- **$10,000 initial liquidity** for all markets (infinite liquidity simulation)
- **$1 minimum trade** amount
- **No trading fees**
- **Google OAuth only** (no email/password)
- **Admin-only market creation** and resolution
- **Real-time price updates** (if feasible)
- **Push notifications** for market resolutions only
- **Market proposals** system with voting

---

## 🗄️ **REVISED DATABASE SCHEMA**

### **1. Users & Authentication**
```sql
-- Extends Supabase auth.users
CREATE TABLE users_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  auth_provider TEXT DEFAULT 'google',
  avatar_url TEXT,
  balance DECIMAL(10,2) DEFAULT 10000.00, -- Starting $10K
  total_volume DECIMAL(12,2) DEFAULT 0,
  markets_won INTEGER DEFAULT 0,
  markets_traded INTEGER DEFAULT 0,
  total_profit_loss DECIMAL(10,2) DEFAULT 0,
  win_rate DECIMAL(5,2) DEFAULT 0, -- Percentage
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON users_profile FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users_profile FOR UPDATE USING (auth.uid() = id);
```

### **2. Markets System**
```sql
-- Main markets table
CREATE TABLE markets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users_profile(id),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  image_url TEXT, -- Added for market images
  type TEXT CHECK (type IN ('binary', 'multiple')) NOT NULL,
  status TEXT CHECK (status IN ('active', 'closed', 'resolved', 'cancelled')) DEFAULT 'active',
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  resolution_date TIMESTAMP WITH TIME ZONE,
  resolution_outcome TEXT, -- For binary: 'yes'/'no', for multiple: option_id
  resolution_admin_id UUID REFERENCES users_profile(id),
  total_volume DECIMAL(12,2) DEFAULT 0,
  participant_count INTEGER DEFAULT 0,
  liquidity_pool DECIMAL(12,2) DEFAULT 10000.00, -- $10K initial liquidity
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Binary markets (YES/NO) - embedded in markets table
-- For binary markets, we'll use two virtual "options": yes and no

-- Multiple choice options
CREATE TABLE market_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID REFERENCES markets(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  option_color TEXT DEFAULT '#3b82f6',
  pool_amount DECIMAL(12,2) DEFAULT 0, -- Money in this option's pool
  share_count DECIMAL(15,6) DEFAULT 0, -- Total shares for this option
  current_price DECIMAL(6,4) DEFAULT 0, -- Current price percentage (0-1)
  is_winning_option BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- For binary markets, we'll store pools in separate table
CREATE TABLE binary_market_pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID REFERENCES markets(id) ON DELETE CASCADE,
  yes_pool DECIMAL(12,2) DEFAULT 5000.00, -- Half of initial liquidity
  no_pool DECIMAL(12,2) DEFAULT 5000.00,  -- Half of initial liquidity
  yes_shares DECIMAL(15,6) DEFAULT 0,
  no_shares DECIMAL(15,6) DEFAULT 0,
  yes_price DECIMAL(6,4) DEFAULT 0.50, -- Starting at 50%
  no_price DECIMAL(6,4) DEFAULT 0.50,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(market_id)
);

-- RLS Policies
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Markets are viewable by everyone" ON markets FOR SELECT USING (true);
CREATE POLICY "Only admins can insert markets" ON markets FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users_profile WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Only admins can update markets" ON markets FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users_profile WHERE id = auth.uid() AND is_admin = true)
);
```

### **3. Trading System**
```sql
-- User trades
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID REFERENCES markets(id) NOT NULL,
  user_id UUID REFERENCES users_profile(id) NOT NULL,
  option_id UUID REFERENCES market_options(id), -- NULL for binary markets
  trade_type TEXT CHECK (trade_type IN ('buy_yes', 'buy_no', 'sell_yes', 'sell_no', 'buy_option', 'sell_option')) NOT NULL,
  amount DECIMAL(10,2) NOT NULL, -- USD amount invested
  shares DECIMAL(15,6) NOT NULL, -- Shares received/sold
  price_per_share DECIMAL(6,4) NOT NULL, -- Price at time of trade
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User positions (current holdings)
CREATE TABLE user_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users_profile(id) NOT NULL,
  market_id UUID REFERENCES markets(id) NOT NULL,
  option_id UUID REFERENCES market_options(id), -- NULL for binary positions
  position_type TEXT CHECK (position_type IN ('yes', 'no', 'option')) NOT NULL,
  shares_owned DECIMAL(15,6) DEFAULT 0,
  average_price DECIMAL(6,4), -- Average price paid
  total_invested DECIMAL(10,2) DEFAULT 0,
  current_value DECIMAL(10,2) DEFAULT 0, -- Updated by triggers
  unrealized_pnl DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, market_id, option_id, position_type)
);

-- RLS for trades and positions
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own trades" ON trades FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own trades" ON trades FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE user_positions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own positions" ON user_positions FOR SELECT USING (auth.uid() = user_id);
```

### **4. Price History & Analytics**
```sql
-- Market price history (for charts)
CREATE TABLE market_price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID REFERENCES markets(id) ON DELETE CASCADE,
  option_id UUID REFERENCES market_options(id), -- NULL for binary markets
  price_type TEXT CHECK (price_type IN ('yes', 'no', 'option')) NOT NULL,
  price DECIMAL(6,4) NOT NULL,
  volume_24h DECIMAL(12,2) DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for efficient chart queries
CREATE INDEX idx_price_history_market_time ON market_price_history(market_id, timestamp DESC);
```

### **5. Comments System**
```sql
-- Market comments
CREATE TABLE market_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID REFERENCES markets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users_profile(id) NOT NULL,
  content TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comment votes (to prevent duplicate voting)
CREATE TABLE comment_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID REFERENCES market_comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users_profile(id) NOT NULL,
  vote_type TEXT CHECK (vote_type IN ('upvote', 'downvote')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- RLS for comments
ALTER TABLE market_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments are viewable by everyone" ON market_comments FOR SELECT USING (true);
CREATE POLICY "Users can insert own comments" ON market_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON market_comments FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE comment_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all votes" ON comment_votes FOR SELECT USING (true);
CREATE POLICY "Users can insert own votes" ON comment_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own votes" ON comment_votes FOR UPDATE USING (auth.uid() = user_id);
```

### **6. Market Proposals System**
```sql
-- User proposed markets
CREATE TABLE market_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposer_id UUID REFERENCES users_profile(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  type TEXT CHECK (type IN ('binary', 'multiple')) NOT NULL,
  proposed_end_date TIMESTAMP WITH TIME ZONE,
  proposed_options JSONB, -- For multiple choice options
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  admin_response TEXT, -- Admin notes
  reviewed_by UUID REFERENCES users_profile(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Proposal votes
CREATE TABLE proposal_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES market_proposals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users_profile(id) NOT NULL,
  vote_type TEXT CHECK (vote_type IN ('upvote', 'downvote')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(proposal_id, user_id)
);

-- RLS for proposals
ALTER TABLE market_proposals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Proposals are viewable by everyone" ON market_proposals FOR SELECT USING (true);
CREATE POLICY "Users can insert own proposals" ON market_proposals FOR INSERT WITH CHECK (auth.uid() = proposer_id);
CREATE POLICY "Admins can update proposals" ON market_proposals FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users_profile WHERE id = auth.uid() AND is_admin = true)
);
```

### **7. Notifications System**
```sql
-- User notifications (for market resolutions only)
CREATE TABLE user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users_profile(id) NOT NULL,
  market_id UUID REFERENCES markets(id),
  type TEXT CHECK (type IN ('market_resolved')) NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for notifications
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON user_notifications FOR SELECT USING (auth.uid() = user_id);
```

---

## 🔧 **DATABASE FUNCTIONS & TRIGGERS**

### **1. Pool-Based Pricing Calculation**
```sql
-- Function to calculate new prices after trade
CREATE OR REPLACE FUNCTION calculate_pool_price(
  total_pool DECIMAL,
  option_pool DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
  IF total_pool <= 0 THEN
    RETURN 0.5; -- Default 50% if no liquidity
  END IF;
  RETURN LEAST(GREATEST(option_pool / total_pool, 0.01), 0.99); -- Clamp between 1%-99%
END;
$$ LANGUAGE plpgsql;

-- Function to execute binary trade
CREATE OR REPLACE FUNCTION execute_binary_trade(
  p_market_id UUID,
  p_user_id UUID,
  p_trade_type TEXT,
  p_amount DECIMAL
) RETURNS JSON AS $$
DECLARE
  pool_record RECORD;
  new_shares DECIMAL;
  new_price DECIMAL;
  trade_result JSON;
BEGIN
  -- Get current pool state
  SELECT * INTO pool_record FROM binary_market_pools WHERE market_id = p_market_id;
  
  -- Calculate shares based on pool ratio
  IF p_trade_type = 'buy_yes' THEN
    new_shares := p_amount / pool_record.yes_price;
    -- Update pools
    UPDATE binary_market_pools 
    SET 
      yes_pool = yes_pool + p_amount,
      yes_shares = yes_shares + new_shares,
      yes_price = calculate_pool_price(yes_pool + no_pool + p_amount, yes_pool + p_amount),
      no_price = calculate_pool_price(yes_pool + no_pool + p_amount, no_pool),
      updated_at = NOW()
    WHERE market_id = p_market_id;
    
  ELSIF p_trade_type = 'buy_no' THEN
    new_shares := p_amount / pool_record.no_price;
    -- Update pools
    UPDATE binary_market_pools 
    SET 
      no_pool = no_pool + p_amount,
      no_shares = no_shares + new_shares,
      yes_price = calculate_pool_price(yes_pool + no_pool + p_amount, yes_pool),
      no_price = calculate_pool_price(yes_pool + no_pool + p_amount, no_pool + p_amount),
      updated_at = NOW()
    WHERE market_id = p_market_id;
  END IF;
  
  -- Record the trade
  INSERT INTO trades (market_id, user_id, trade_type, amount, shares, price_per_share)
  VALUES (p_market_id, p_user_id, p_trade_type, p_amount, new_shares, 
          CASE WHEN p_trade_type = 'buy_yes' THEN pool_record.yes_price ELSE pool_record.no_price END);
  
  -- Update user position
  -- (Implementation depends on exact business logic)
  
  RETURN json_build_object('success', true, 'shares', new_shares);
END;
$$ LANGUAGE plpgsql;
```

### **2. Triggers for Real-time Updates**
```sql
-- Trigger to update market volume
CREATE OR REPLACE FUNCTION update_market_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE markets 
  SET 
    total_volume = (SELECT COALESCE(SUM(amount), 0) FROM trades WHERE market_id = NEW.market_id),
    participant_count = (SELECT COUNT(DISTINCT user_id) FROM trades WHERE market_id = NEW.market_id),
    updated_at = NOW()
  WHERE id = NEW.market_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_market_stats
  AFTER INSERT ON trades
  FOR EACH ROW EXECUTE FUNCTION update_market_stats();

-- Trigger to record price history
CREATE OR REPLACE FUNCTION record_price_history()
RETURNS TRIGGER AS $$
BEGIN
  -- Record YES price
  INSERT INTO market_price_history (market_id, price_type, price)
  VALUES (NEW.market_id, 'yes', NEW.yes_price);
  
  -- Record NO price
  INSERT INTO market_price_history (market_id, price_type, price)
  VALUES (NEW.market_id, 'no', NEW.no_price);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_record_price_history
  AFTER UPDATE ON binary_market_pools
  FOR EACH ROW EXECUTE FUNCTION record_price_history();
```

---

## 🚀 **IMPLEMENTATION STEPS**

### **Phase 1: Database Setup (Day 1)**
1. **Create Supabase project**
2. **Execute SQL schema** (copy-paste the SQL above)
3. **Set up Row Level Security policies**
4. **Create database functions and triggers**
5. **Test with sample data**

### **Phase 2: Authentication (Day 2)**
1. **Configure Google OAuth in Supabase**
2. **Install Supabase client in Next.js**
3. **Create auth provider context**
4. **Add login/logout buttons**
5. **Create user profile on first login**

### **Phase 3: API Integration (Day 3-4)**
1. **Create Supabase client utilities**
2. **Replace mock data with real API calls**
3. **Implement real-time subscriptions**
4. **Add error handling and loading states**

### **Phase 4: Trading System (Day 5-6)**
1. **Build trading interface**
2. **Implement buy/sell functionality**
3. **Real-time price updates**
4. **Portfolio calculation and display**

### **Phase 5: Additional Features (Day 7-8)**
1. **Comments system**
2. **Market proposals**
3. **Admin panel for market management**
4. **Notifications system**

---

## 📁 **FRONTEND UPDATES NEEDED**

### **New Components to Create:**
1. `AuthProvider` - Supabase auth context
2. `LoginButton` - Google OAuth login
3. `TradingInterface` - Buy/sell shares
4. `Portfolio` - User positions and stats
5. `Comments` - Market discussion
6. `MarketProposals` - Propose new markets
7. `AdminPanel` - Market resolution tools
8. `NotificationBell` - Push notifications

### **Updated Components:**
1. `MarketsGrid` - Real data from Supabase
2. `MarketChart` - Real price history
3. `Navbar` - Add auth and notifications

### **New Pages:**
1. `/profile` - User profile and portfolio
2. `/admin` - Admin market management
3. `/proposals` - Market proposals

---

## ❓ **QUESTIONS FOR CLARIFICATION**

1. **Market Images**: Should we use a specific image service (Unsplash, Cloudinary) or allow direct URL input?

2. **Admin Creation**: How do you want to designate the first admin? Manual database update?

3. **Market Proposals**: Should proposals have a minimum vote threshold before admin review?

4. **Price History**: How often should we record price snapshots? (Every trade, hourly, daily?)

5. **User Profiles**: Should usernames be auto-generated from Google name or user-chosen during first login?

---

**Ready to proceed with implementation?** 

The schema above covers all your requirements and matches your frontend. Let me know if you want me to start with the database setup or if you need any adjustments to the schema!
