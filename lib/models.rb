class Account
  include DataMapper::Resource

  property :id, Serial
  property :email, String
  property :uuid, String, :required => true

  def self.by_uuid( uuid )
    first( :uuid => uuid )
  end

  has 1, :backlog, :constraint => :destroy
  has n, :card_walls, :constraint => :destroy
  has n, :swim_lanes, :through => :card_walls
  has n, :cards, :through => :card_walls
end

class CardWall
  include DataMapper::Resource

  property :id, Serial
  property :name, String
  property :description, Text
  property :created_at, DateTime, :default => lambda { Time.now }

  belongs_to :account
  has n, :swim_lanes, :constraint => :destroy
  has n, :cards, :through => :swim_lanes
end

class Backlog
  include DataMapper::Resource

  property :id, Serial
  property :name, String
  property :description, Text
  property :created_at, DateTime, :default => lambda { Time.now }

  belongs_to :account
  has n, :cards, :constraint => :destroy
end

class SwimLane
  include DataMapper::Resource

  property :id, Serial
  property :position, Integer
  property :name, String
  property :description, Text
  property :created_at, DateTime, :default => lambda { Time.now }

  has n, :cards, :constraint => :destroy
end

class Card
  include DataMapper::Resource
  PRIORITIES = { :regular => 0, :expedited => 1 }

  property :id, Serial
  property :description, Text, :length => 0..140
  property :estimate, Integer
  property :priority, Integer, :default => PRIORITIES[ :regular ]
  property :created_at, DateTime, :default => lambda { Time.now }

  belongs_to :swim_lane, :required => false
  belongs_to :backlog, :required => false
  has n, :comments

  def self.expedited
    all( :priority => PRIORITIES[ :expedited ] )
  end

  def self.regular
    all( :priority => PRIORITIES[ :regular ] )
  end
end

class Comment
  include DataMapper::Resource

  property :id, Serial
  property :body, Text
  property :created_at, DateTime, :default => lambda { Time.now }

  belongs_to :card
end
