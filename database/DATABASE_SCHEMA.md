# DATABASE SCHEMA - PREDIK.IO

## TRADES TABLE
- `id` (uuid)
- `market_id` (text)
- `user_id` (uuid)
- `option_id` (text)
- `trade_type` (text)
- `amount` (numeric)
- `shares` (numeric)
- `price_per_share` (numeric)
- `created_at` (timestamptz)

**Total: 9 columns**

## USER_POSITIONS TABLE
- `id` (uuid)
- `user_id` (uuid)
- `market_id` (text)
- `option_id` (text)
- `position_type` (text)
- `shares_owned` (numeric)
- `average_price` (numeric)
- `total_invested` (numeric)
- `current_value` (numeric)
- `unrealized_pnl` (numeric)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**Total: 12 columns**

## MARKETS TABLE
- `id` (text)
- `creator_id` (uuid)
- `title` (text)
- `description` (text)
- `category` (text)
- `image_url` (text)
- `type` (text)
- `status` (text)
- `end_date` (timestamptz)
- `resolution_date` (timestamptz)
- `resolution_outcome` (text)
- `resolution_admin_id` (uuid)
- `total_volume` (numeric)
- `participant_count` (int4)
- `liquidity_pool` (numeric)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**Total: 17 columns**

## MARKET_OPTIONS TABLE
- `id` (text)
- `market_id` (text)
- `option_text` (text)
- `option_color` (text)
- `pool_amount` (numeric)
- `share_count` (numeric)
- `current_price` (numeric)
- `is_winning_option` (bool)
- `created_at` (timestamptz)

**Total: 9 columns**

## BINARY_MARKET_POOLS TABLE
- `id` (uuid)
- `market_id` (text)
- `yes_pool` (numeric)
- `no_pool` (numeric)
- `yes_shares` (numeric)
- `no_shares` (numeric)
- `yes_price` (numeric)
- `no_price` (numeric)
- `updated_at` (timestamptz)

**Total: 9 columns**

## USERS_PROFILE TABLE
- `id` (uuid)
- `full_name` (text)
- `username` (text)
- `auth_provider` (text)
- `avatar_url` (text)
- `balance` (numeric)
- `total_volume` (numeric)
- `markets_won` (int4)
- `markets_traded` (int4)
- `total_profit_loss` (numeric)
- `win_rate` (numeric)
- `is_admin` (bool)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**Total: 14 columns**

## OTHER TABLES

### PROPOSAL_VOTES TABLE
- `id` (text)
- `proposal_id` (text)
- `user_id` (uuid)
- `vote_type` (text)
- `created_at` (timestamptz)

**Total: 5 columns**

### MARKET_PROPOSALS TABLE
- `id` (text)
- `proposer_id` (uuid)
- `title` (text)
- `description` (text)
- `category` (text)
- `type` (text)
- `proposed_end_date` (timestamptz)
- `proposed_options` (jsonb)
- `status` (text)
- `admin_response` (text)
- `reviewed_by` (uuid)
- `reviewed_at` (timestamptz)
- `upvotes` (int4)
- `downvotes` (int4)
- `created_at` (timestamptz)

**Total: 15 columns**

### USER_NOTIFICATIONS TABLE
- `id` (text)
- `user_id` (uuid)
- `market_id` (text)
- `type` (text)
- `title` (text)
- `content` (text)
- `is_read` (bool)
- `created_at` (timestamptz)

**Total: 8 columns**

### COMMENT_VOTES TABLE
- `id` (text)
- `comment_id` (text)
- `user_id` (uuid)
- `vote_type` (text)
- `created_at` (timestamptz)

**Total: 5 columns**

### MARKET_PRICE_HISTORY TABLE
- `id` (text)
- `market_id` (text)
- `option_id` (text)
- `price_type` (text)
- `price` (numeric)
- `volume_24h` (numeric)
- `timestamp` (timestamptz)

**Total: 7 columns**

## SUMMARY
- **11 tables total**
- **TRADES**: 9 columns
- **USER_POSITIONS**: 12 columns  
- **MARKETS**: 17 columns
- **MARKET_OPTIONS**: 9 columns
- **BINARY_MARKET_POOLS**: 9 columns
- **USERS_PROFILE**: 14 columns
- **PROPOSAL_VOTES**: 5 columns
- **MARKET_PROPOSALS**: 15 columns
- **USER_NOTIFICATIONS**: 8 columns
- **COMMENT_VOTES**: 5 columns
- **MARKET_PRICE_HISTORY**: 7 columns
