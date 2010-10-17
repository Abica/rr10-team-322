class Account
  include DataMapper::Resource

  property :id, Serial
  property :email, String
  property :uuid, String, :required => true

  has n, :card_walls
end

class CardWall
  include DataMapper::Resource

  property :id, Serial
  property :name, String
  property :description, Text
  property :created_at, DateTime, :default => lambda { Time.now }

  belongs_to :account
  has n, :swim_lanes
end

class SwimLane
  include DataMapper::Resource

  property :id, Serial
  property :position, Integer
  property :name, String
  property :description, Text
  property :created_at, DateTime, :default => lambda { Time.now }

  has n, :cards
end

class Card
  include DataMapper::Resource

  property :id, Serial
  property :description, String
  property :estimate, Integer
  property :created_at, DateTime, :default => lambda { Time.now }

  belongs_to :swim_lane
  has n, :comments
end

class Comment
  include DataMapper::Resource

  property :id, Serial
  property :body, Text
  property :created_at, DateTime, :default => lambda { Time.now }

  belongs_to :card
end
