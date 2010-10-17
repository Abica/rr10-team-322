require 'sinatra'
require 'haml'
require 'sass'
require 'json'
require 'datamapper'
require 'dm-sqlite-adapter'
require 'uuidtools'

require 'lib/models'
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

helpers do
  def json( obj )
    obj.to_json
  end
end


# ACCOUNTS
  # create account
  post '/account' do
    account = Account.create(
      :uuid => UUIDTools::UUID.random_create,
      :email => params[ :email ],
      :backlog => Backlog.create )
    backlog = account.backlog
    backlog.cards.create( :description => "I am a card in the backlog" )
    backlog.cards.create( :description => "New cards are added to the backlog" )
    backlog.cards.create( :description => "The backlog is visible across sprints" )

    card_wall = account.card_walls.create( :name => "Sprint 1" )

    free_cards = card_wall.swim_lanes.create( :name => "Free Cards" )
    free_cards.cards.create( :description => "This lane is for expedited cards", :priority => Card::PRIORITIES[ :expedited ] )
    free_cards.cards.create( :description => "A card represents a task in 1 sentence" )

    card_wall.swim_lanes.create( :name => "Define Acceptance" )
    development = card_wall.swim_lanes.create( :name => "Development" )
    development.cards.create( :description => "Cards are moved throughout their life cycle" )
    development.cards.create( :description => "Touch a card to modify it" )

    card_wall.swim_lanes.create( :name => "Test" )
    card_wall.swim_lanes.create( :name => "Deploy" )

    completed = card_wall.swim_lanes.create( :name => "Completed" )
    completed.cards.create( :description => "Only add new cards when a card is completed" )

    redirect "/#{ account.uuid }"
  end

# SPRINTS
  # get sprint
  get '/:uuid/sprint/:id' do
    content_type :json

    account = Account.by_uuid( params[ :uuid ] )
    card_wall = account.card_walls.get( params[ :id ] )

    json card_wall
  end

  # create sprint
  post '/:uuid/sprint' do
    content_type :json
    account = Account.by_uuid( params[ :uuid ] )
    card_wall = account.card_walls.create( params[ :sprint ] )

    json card_wall
  end

  # update sprint
  post '/:uuid/sprint/:id' do
    content_type :json

    account = Account.by_uuid( params[ :uuid ] )
    card_wall = account.card_walls.get( params[ :id ] )
    card_wall.update( params[ :sprint ] )

    json card_wall
  end

  # delete sprint
  delete '/:uuid/sprint/:id' do
    content_type :json

    account = Account.by_uuid( params[ :uuid ] )
    card_wall = account.card_walls.get( params[ :id ] )

    json card_wall.destroy
  end



# SWIM LANES
  # get swim lane
  get '/:uuid/sprint/:sprint_id/swim_lane/:swim_lane_id' do
    content_type :json

    account = Account.by_uuid( params[ :uuid ] )
    card_wall = account.card_walls.get( params[ :sprint_id ] )
    swim_lane = card_wall.swim_lanes.get( params[ :id ] )

    json swim_lane
  end

  # create swim lane
  post '/:uuid/sprint/:id/swim_lane' do
    content_type :json

    account = Account.by_uuid( params[ :uuid ] )
    card_wall = account.card_walls.get( params[ :sprint_id ] )
    swim_lane = card_wall.swim_lanes.create( params[ :swim_lane ] )

    json swim_lane
  end

  # update swim lane
  post '/:uuid/sprint/:sprint_id/swim_lane/:id' do
    content_type :json

    account = Account.by_uuid( params[ :uuid ] )
    card_wall = account.card_walls.get( params[ :sprint_id ] )
    swim_lane = card_wall.swim_lanes.get( params[ :id ] )
    swim_lane.update( params[ :swim_lane ] )

    json lane
  end

  # delete swim lane
  delete '/:uuid/sprint/:sprint_id/swim_lane/:id' do
    content_type :json

    account = Account.by_uuid( params[ :uuid ] )
    card_wall = account.card_walls.get( params[ :sprint_id ] )
    swim_lane = card_wall.swim_lanes.get( params[ :id ] )

    json swim_lane.destroy
  end

# CARD
  # get card
  get '/:uuid/sprint/:sprint_id/swim_lane/:swim_lane_id/card/:id' do
    content_type :json

    account = Account.by_uuid( params[ :uuid ] )
    card_wall = account.card_walls.get( params[ :sprint_id ] )
    swim_lane = card_wall.swim_lanes.get( params[ :swim_lane_id ] )
    card = swim_lane.cards.get( params[ :id ] )

    json card
  end

  # new card
  post '/:uuid/sprint/:sprint_id/swim_lane/:swim_lane_id/card' do
    content_type :json

    account = Account.by_uuid( params[ :uuid ] )
    card_wall = account.card_walls.get( params[ :sprint_id ] )
    swim_lane = card_wall.swim_lanes.get( params[ :swim_lane_id ] )
    card = swim_lane.cards.create( params[ :card ] )

    json card
  end

  # update card
  post '/:uuid/sprint/:sprint_id/swim_lane/:swim_lane_id/card/:card_id' do
    content_type :json

    account = Account.by_uuid( params[ :uuid ] )
    card_wall = account.card_walls.get( params[ :sprint_id ] )
    swim_lane = card_wall.swim_lanes.get( params[ :swim_lane_id ] )
    card = swim_lane.cards.get( params[ :id ] )
    card.update( params[ :card ] )

    json card
  end

  # delete card
  delete '/:uuid/sprint/:sprint_id/swim_lane/:swim_lane_id/card/:id' do
    content_type :json

    account = Account.by_uuid( params[ :uuid ] )
    card_wall = account.card_walls.get( params[ :sprint_id ] )
    swim_lane = card_wall.swim_lanes.get( params[ :swim_lane_id ] )
    card = swim_lane.cards.get( params[ :id ] )

    json card.destroy
  end


# DEFAULT ROUTES
  get '/' do
    haml :index, :layout => true
  end

  get '/main.css' do
    content_type 'text/css', :charset => 'utf-8'
    sass :stylesheet, :syntax => :scss
  end

  get '/test' do
    redirect "/"
  end

  # show sandbox
  get '/:uuid' do
    @account = Account.by_uuid( params[ :uuid ] )
    @backlog = @account.backlog
    @card_wall = @account.card_walls.first or []
    haml :sandbox, :layout => true
  end
