require 'sinatra'
require 'haml'
require 'sass'
require 'json'
require 'sqlite3'
require 'datamapper'
require 'pp'

configure do
  set :sessions , true

  DataMapper::Logger.new($stdout, :debug)
  DataMapper.setup( :default , "sqlite3://#{Dir.pwd}/development.sqlite3" )
  DataMapper.finalize
  DataMapper.auto_upgrade!
end

error do
  e = request.env['sinatra.error']
  Kernel.puts e.backtrace.join("\n")
  'Application error'
end

module OhKanban
  module Models
    class Company
      include DataMapper::Resource

      property :id, Serial
      property :name, String

      has n, :teams
    end

    class Team
      include DataMapper::Resource

      property :id, Serial
      property :name, String

      belongs_to :company
      has n, :users, :through => Resource
      has n, :card_walls
    end

    class User
      include DataMapper::Resource

      property :id, Serial
      property :email, String

      has n, :teams, :through => Resource
      has n, :cards, :through => Resource
      has n, :card_walls
      has n, :comments
    end

    class CardWall
      include DataMapper::Resource

      property :id, Serial
      property :name, String
      property :description, Text
      property :created_at, DateTime

      has n, :belongs_to, :teams
      has n, :swim_lanes
    end

    class SwimLane
      include DataMapper::Resource

      property :id, Serial
      property :position, Integer
      property :name, String
      property :description, Text
      property :created_at, DateTime

      has n, :cards
    end

    class Card
      include DataMapper::Resource

      property :id, Serial
      property :description, String
      property :estimate, Integer
      property :created_at, DateTime

      belongs_to :swim_lane
      has n, :comments
      has n, :users, :through => Resource
    end

    class Comment
      include DataMapper::Resource

      property :id, Serial
      property :body, Text
      property :created_at, DateTime

      belongs_to :user
      belongs_to :card
    end
  end
end

include OhKanban::Models

helpers do
end

get '/' do
  haml :index, :layout => true
end

# SPRINTS
get '/sprint/:id' do
end

post '/sprint/:id' do
end

post '/sprint/new' do
end

# SWIM LANES
get '/sprint/:id/swim_lane/:swim_lane_id' do
end

post '/sprint/:id/swim_lane/:swim_lane_id' do
end

post '/sprint/:id/swim_lane/new' do
end

# CARD
get '/sprint/:id/swim_lane/:swim_lane_id/card/:card_id' do
end

post '/sprint/:id/swim_lane/:swim_lane_id/card/:card_id' do
end

post '/sprint/:id/swim_lane/:swim_lane_id/card/new' do
end

# COMMENT
get '/sprint/:id/swim_lane/:swim_lane_id/card/:card_id/comments' do
end

post '/sprint/:id/swim_lane/:swim_lane_id/card/:card_id/comments/new' do
end


get '/main.css' do
  content_type 'text/css', :charset => 'utf-8'
  sass :stylesheet, :syntax => :scss
end

get '/test' do
  haml :test, :layout => true
end
