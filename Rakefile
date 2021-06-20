site = "wellington.session.nz"
port = "4002"

##############
#   Develop  #
##############

# Useful for development
# It watches for changes and updates when it finds them
# Usage: rake watch

desc "Watch the site and regenerate when it changes"
task :watch do
  system "JEKYLL_ENV=development bundle exec jekyll serve --config '_config.yml,_config_localhost.yml' --watch --host=0.0.0.0 --port=#{port}"
end

##############
# Tunebooks  #
##############

# Build the PDF Tunebooks
# Usage: rake tunebooks

desc "build the pdf tunebooks"
task :tunebooks do
    system "_scripts/add-tunebook-pdfs.sh"
end

####################
# createMD options #
#################### 

# Build the options
# Usage: rake createMD

desc "build the createMD option"
task :createMD do
    system "_scripts/mk_createMD_options.py #{site}"
end

##############
#  MP3 push  #
##############

# Deploy MP3 and tunebook files to the site
# Usage: rake mp3push

desc "deploy MP3s to the site"
task :mp3push do
    system "ssh -t #{site} sudo /usr/local/sbin/update-mp3files.sh"
end   

##############
#  MP3 check  #
##############

# Check MP3 and tunebook files on the site
# Usage: rake mp3check

desc "check MP3s on the site"
task :mp3check do
    system "ssh -t #{site} sudo /usr/local/sbin/check-site.sh"
end   

##############
#   Deploy   #
##############

# Deploy the site
# Usage: rake deploy

desc "deploy the site"
task :deploy do
    system "ssh -t #{site} sudo /usr/local/sbin/update-site.sh"
end   

##############
#   Build    #
##############

# Generate the site
# Usage: rake build

desc "build the site"
task :build do
  system "JEKYLL_ENV=production bundle exec jekyll build"
end
