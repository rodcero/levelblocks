from google.appengine.ext import ndb

class User(ndb.Model):
    email = ndb.StringProperty(indexed=True)
    nickname = ndb.StringProperty(required=True)
    score = ndb.IntegerProperty(required=True)
    played = ndb.IntegerProperty(required=True)
    
    @classmethod
    def get_all(cls):
        return User.query().fetch()

    @classmethod
    def get_top10(cls):
        return User.query().order(-User.score).fetch(10)
    
    @classmethod
    def getByEmail(cls, email):
        users = User.query(User.email == email).fetch(1)
        if users:
            return users[0]
        else:
            return None

    @classmethod
    def getById(cls, lid):
        return User.get_by_id(lid)

    @classmethod
    def getLevelBlockUser(cls, user):
        if user:
            email = user.email()
            userlist = User.query(User.email == email).fetch(1)

            if userlist:
                return userlist[0]
            else:
                newuser = User()
                newuser.email = user.email()
                newuser.nickname = 'Anonymous'
                newuser.score = 0
                newuser.played = 0
                newuser.put()
                return newuser
        else:
            return None