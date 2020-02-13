# clean up previous remains, if any
rm -rf Contents/Resources
rm -rf React_Native.docset
mkdir -p Contents/Resources/Documents

# create a fresh sqlite db
cd Contents/Resources
sqlite3 docSet.dsidx 'CREATE TABLE searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT)'
sqlite3 docSet.dsidx 'CREATE UNIQUE INDEX anchor ON searchIndex (name, type, path)'

# fetch the whole doc site
cd Documents
wget -m -p -E -k -np --reject-regex 'versions|blog' http://facebook.github.io/react-native/

# move it around a bit
mv facebook.github.io/react-native ./
rm -rf facebook.github.io
cd ../../../

# create data file from base index page
node src/createSectionJSON.js

# change the documentation markup layout a bit to fit dash's small window
node src/modifyDocsHTML.js

# read the previously fetched doc site and parse it into sqlite
node src/index.js

# bundle up!
mkdir React_Native.docset
cp -r Contents React_Native.docset
cp src/icon* React_Native.docset

# Create gzip bundle for Dash Contribution
tar --exclude='.DS_Store' -cvzf React_Native.tgz React_Native.docset
