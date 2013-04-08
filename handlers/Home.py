import webapp2
import math

from model.Level import Level
from model.User import User
from webapp2_extras import sessions
from google.appengine.api import users
import jinja2
import os
import json
import urllib

from google.appengine.ext import blobstore
from google.appengine.ext.webapp import blobstore_handlers

jinja_environment = jinja2.Environment(autoescape=True,
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__) + "/../templates"))

class BaseHandler(webapp2.RequestHandler):
    def dispatch(self):
        # Get a session store for this request.
        self.session_store = sessions.get_store(request=self.request)

        try:
            # Dispatch the request.
            webapp2.RequestHandler.dispatch(self)
        finally:
            # Save all sessions.
            self.session_store.save_sessions(self.response)


    @webapp2.cached_property
    def session(self):
        # Returns a session using the default cookie key.
        return self.session_store.get_session()

class IndexHandler(BaseHandler):
    def get(self):
        max = Level.getByMaxJackpot()
        score = Level.getByHighScore()
        popular = Level.getByMostPlayed()

        template_values = {
            'max': max,
            'score': score,
            'popular': popular
        }

        template = jinja_environment.get_template('index.html')
        self.response.out.write(template.render(template_values))

class EditorHandler(BaseHandler):
    def get(self, level_id):

        template_values = {
            'level': Level.getById(int(level_id)) if level_id else 0
        }

        template = jinja_environment.get_template('editor.html')
        self.response.out.write(template.render(template_values))

    def post(self, level_id):
        user = User.getLevelBlockUser(users.get_current_user())

        if user:
            level = self.request.get('level')
            name = self.request.get('name')
            if level_id:
                l = Level.getById(int(level_id))
                #only modify if you are the original author
                if l.user.id == user.key.id:
                    l.name = name
                    l.user = user.key
                    l.score = 0
                    l.published = False
                    l.level = str(level)
                    l.put()
            else:
                l = Level()
                l.name = name
                l.user = user.key
                l.score = 0
                l.published = False
                l.level = str(level)
                l.put()

            self.response.out.write(level)

        else:
            template_values = {
                'signinurl': users.create_login_url("/")
            }

            template = jinja_environment.get_template('signin.html')
            self.response.out.write(template.render(template_values))

class LevelHandler(BaseHandler):
    def get(self):
        template_values = {
            'levels' : Level.get_all()
        }

        template = jinja_environment.get_template('levels.html')
        self.response.out.write(template.render(template_values))

class LevelFileHandler(BaseHandler):
    def get(self, level=''):
        if level:
            self.response.headers['Content-Type'] = 'application/json'
            self.response.out.write(Level.getByName(level)[0].level)

class UserLevelHandler(BaseHandler):
    def get(self):

        user = User.getLevelBlockUser(users.get_current_user())
        #checks to see if we have a user signed in
        if user:
            template_values = {
                'levels' : Level.getUserLevels(user.key),
                'currentuser': user.nickname
            }

            template = jinja_environment.get_template('userlevels.html')
            self.response.out.write(template.render(template_values))
        #if not is ask them to sign in
        else:
            template_values = {
                'signinurl' : users.create_login_url("/")
            }

            template = jinja_environment.get_template('signin.html')
            self.response.out.write(template.render(template_values))

class UserLevelDeleteHandler(BaseHandler):
    def get(self, level=""):
        if level:
            l = Level.getById(int(level))
            l.key.delete()
        self.redirect("/mylevels")




class GameHandler(BaseHandler):
    def get(self, levelid=""):
        user = User.getLevelBlockUser(users.get_current_user())
        #checks to see if we have a user signed in
        if user:
            currentlevel = Level.getById(int(levelid))
            creator = User.get_by_id(currentlevel.user.id())
            template_values = {
                'level': currentlevel,
                'creator': creator
            }

            template = jinja_environment.get_template('game.html')
            self.response.out.write(template.render(template_values))

        #if not is ask them to sign in
        else:
            template_values = {
                'signinurl' : users.create_login_url("/")
            }

            template = jinja_environment.get_template('signin.html')
            self.response.out.write(template.render(template_values))

    def post(self, levelid=""):
        user = User.getLevelBlockUser(users.get_current_user())
        currentlevel = Level.getById(int(levelid))
        action = self.request.get('done')
        if user:
            if action == 'true':
                self.response.headers['Content-Type'] = 'application/json'
                #check to see if level belongs to user and is if published
                if currentlevel.user.id == user.key.id:
                    if not currentlevel.published:
                        currentlevel.published = True
                        currentlevel.played += 1
                        currentlevel.put()
                    else:
                        user.score += 1
                        user.put()
                    self.response.out.write('{"points": 1, "publish": true}')
                else:
                    score = 0
                    if currentlevel.jackpot:
                        score = math.ceil(currentlevel.score * 0.5)
                        creator = User.get_by_id(currentlevel.user.id())
                        creator.score += int(score)
                        creator.put()
                        currentlevel.jackpot = False
                        currentlevel.played += 1
                        currentlevel.put()
                    else:
                        score += math.ceil(currentlevel.score * 0.1)
                    user.score += int(score)
                    user.put()
                    self.response.out.write('{"points": ' + str(score) + ', "publish": false}')
            else:
                if currentlevel.published:
                    if currentlevel.jackpot:
                        currentlevel.score += 1

                    currentlevel.played += 1
                    currentlevel.put()

        else:
            template_values = {
                'signinurl' : users.create_login_url("/")
            }

            template = jinja_environment.get_template('signin.html')
            self.response.out.write(template.render(template_values))



class ProfileHandler(BaseHandler):
    def get(self):

        user = users.get_current_user()
        #checks to see if we have a user signed in
        if user:
            userProfile = User.getByEmail(user.email())
            #if user profile is empty create one
            if not userProfile:
                userProfile = User()
                userProfile.email = user.email()
                userProfile.nickname = 'Anonymous'
                userProfile.score = 0
                userProfile.played = 0
                userProfile.put()

            template_values = {
                'user': userProfile
            }

            template = jinja_environment.get_template('profile.html')
            self.response.out.write(template.render(template_values))
        #if not is ask them to sign in
        else:
            template_values = {
                'signinurl' : users.create_login_url("/")
            }

            template = jinja_environment.get_template('signin.html')
            self.response.out.write(template.render(template_values))

    def post(self):
        user = users.get_current_user()
        #checks to see if we have a user signed in
        if user:
            userProfile = User.getByEmail(user.email())
            #if user profile is empty create one
            userProfile.nickname = self.request.get("nickname")
            userProfile.put()

class HallOfFameHandler(BaseHandler):
    def get(self):

        template_values = {
            'topusers' : User.get_top10()
        }

        template = jinja_environment.get_template('halloffame.html')
        self.response.out.write(template.render(template_values))
