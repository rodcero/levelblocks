from google.appengine.ext import ndb

class Level(ndb.Model):
    name = ndb.StringProperty(indexed=True)
    user = ndb.KeyProperty(required=True)
    score = ndb.IntegerProperty(default=1)
    played = ndb.IntegerProperty(default=0)
    published = ndb.BooleanProperty(default=False)
    level = ndb.BlobProperty(indexed=False)
    jackpot = ndb.BooleanProperty(default=True)
    
    @classmethod
    def get_all(cls):
        return Level.query().fetch()

    @classmethod
    def getUserLevels(cls, userkey):
        return Level.query(Level.user == userkey).fetch()

    @classmethod
    def getByHighScore(cls):
        return Level.query(Level.published == True, Level.jackpot == False).order(-Level.score).fetch(20)

    @classmethod
    def getByMaxJackpot(cls):
        return Level.query(Level.published == True, Level.jackpot == True).order(-Level.score).fetch(20)

    @classmethod
    def getByMostPlayed(cls):
        return Level.query(Level.published == True, Level.jackpot == False).order(-Level.played).fetch(20)
    
    @classmethod
    def getByName(cls, name):
        return Level.query(Level.name == name).fetch(1)

    @classmethod
    def getById(cls, lid):
        return Level.get_by_id(lid)
        