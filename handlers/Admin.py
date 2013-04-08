import webapp2
import jinja2
import os

from google.appengine.ext import blobstore
from google.appengine.ext.webapp import blobstore_handlers

jinja_environment = jinja2.Environment(autoescape=True,
                                       loader=jinja2.FileSystemLoader(os.path.dirname(__file__) + "/../templates"))


class Admin(webapp2.RequestHandler):
    def get(self):
        template_values = {
        }

        template = jinja_environment.get_template('admin.html')
        self.response.out.write(template.render(template_values))

class NewItem(webapp2.RequestHandler):
    def get(self):
        upload_url = blobstore.create_upload_url('/admin/upload')
        template_values = {
            'upload_url' : upload_url
        }

        template = jinja_environment.get_template('newitem.html')
        self.response.out.write(template.render(template_values))

class DeleteItem(webapp2.RequestHandler):
    def get(self):
        id = int(self.request.get('id'))


        self.redirect('/admin/')

class SaveItem(webapp2.RequestHandler):
    def post(self):
        self.redirect('/admin/')

class EditItem(webapp2.RequestHandler):
    def get(self):
        id = int(self.request.get('id'))

        template_vars = {'post' : 'test'}

        template = jinja_environment.get_template('new-post.html')
        self.response.out.write(template.render(template_vars))

class FileHandler(blobstore_handlers.BlobstoreUploadHandler):
    def post(self):
        return ""