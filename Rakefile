site = "wellington.session.nz"
port = "4002"

##############
#   Build    #
##############

# Generate the site
# Minify, optimize, and compress

desc "build the site"
task :build do
  system "JEKYLL_ENV=production bundle exec jekyll build"
end

##############
#   Develop  #
##############

# Useful for development
# It watches for changes and updates when it finds them

desc "Watch the site and regenerate when it changes"
task :watch do
  system "JEKYLL_ENV=development bundle exec jekyll serve --config '_config.yml,_config_localhost.yml' --watch --host=0.0.0.0 --port=#{port}"
end

##############
# Tunebooks  #
##############

# Build the PDF Tunebooks

desc "build the pdf tunebooks"
task :tunebooks do
    system "_scripts/add-tunebook-pdfs.sh"
end

####################
# createMD options #
#################### 

# Build the options

desc "build the createMD option"
task :createMD do
    system "_scripts/mk_createMD_options.py #{site}"
end

##############
#   Deploy   #
##############

# Deploy the site

desc "deploy the site"
task :deploy do
    system "ssh -t #{site} sudo /usr/local/sbin/update_site.sh"
end   
