# Product website
This is a product website for affiliate marketing.

A `.env` file with the following structure must be placed in the root directory.
```
LOCAL_SERVER=http://localhost:3000
REMOTE_SERVER=http://localhost:3000
LOCAL_DB=mongodb://localhost/dbname
# process.env.MONGODB_URI on heroku
REMOTE_DB=mongodb://localhost/dbname
# comma separated countries with data in DB - us,de,gb etc...
# must be present in DB!!
COUNTRIES=us
```