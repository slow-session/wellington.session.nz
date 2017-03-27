site = "wellington.session.nz"

##############
#   Build    #
##############

# Generate the site
# Minify, optimize, and compress

desc "build the site"
task :build do
  system "jekyll build --incremental"
end

##############
#   Develop  #
##############

# Useful for development
# It watches for chagnes and updates when it finds them

desc "Watch the site and regenerate when it changes"
task :watch do
  system "jekyll serve --config '_config.yml,_config_localhost.yml' --watch --port=4001"
end
