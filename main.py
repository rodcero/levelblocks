from google.appengine.ext.webapp.util import run_wsgi_app
import webapp2
from handlers import Home
from handlers import Admin
import os

path = os.path.dirname(__file__)

config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': 'a1b2c3a4b5c6',
    }

app = webapp2.WSGIApplication([('/', Home.IndexHandler),
                               ('/game/(.*)/?', Home.GameHandler),
                               ('/editor/(.*)', Home.EditorHandler),
                               ('/mylevels/delete/(.*)', Home.UserLevelDeleteHandler),
                               ('/mylevels/?', Home.UserLevelHandler),
                               ('/level/?', Home.LevelHandler),
                               ('/level/(.*)/', Home.LevelFileHandler),
                               ('/admin/?', Admin.Admin),
                               ('/profile/?', Home.ProfileHandler),
                               ('/halloffame/?', Home.HallOfFameHandler),
                               ('/admin/item/new/?', Admin.NewItem),
                               ('/admin/item/delete/?', Admin.DeleteItem),
                               ('/admin/item/save/?', Admin.SaveItem),
                               ('/admin/item/edit/?', Admin.EditItem),
                               ('/admin/upload/?', Admin.FileHandler)
                              ], debug=True, config=config)
run_wsgi_app(app)
