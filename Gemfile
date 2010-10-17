source :gemcutter
source "http://gems.github.com"
source "http://gems.engineyard.com"

gem 'sinatra',        '~>1.0'
gem 'haml',           '~>3.0.0'
gem 'rack-contrib',   '~>0.9.2'
gem 'json'
gem 'datamapper'
gem 'shotgun'
gem 'uuidtools'
gem 'thin'

group :production do
#gem 'dm-mysql-adapter'
   gem 'dm-sqlite-adapter'
#  gem 'mysql', '2.8.1'
end

group :test do
  gem 'dm-sqlite-adapter'
end
