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

helpers do
end

get '/' do
  haml :index, :layout => true
end

get '/main.css' do
  content_type 'text/css', :charset => 'utf-8'
  sass :stylesheet, :syntax => :scss
end

get '/test' do
  haml :test, :layout => true
end
