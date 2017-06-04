# -*- coding:utf8 -*-
import os
import urllib
import re
import urllib2
import jinja2
import webapp2

from google.appengine.api import users
from google.appengine.ext import blobstore
from google.appengine.ext import ndb
from google.appengine.ext.webapp import blobstore_handlers
from google.appengine.ext.webapp.util import run_wsgi_app

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

DEFAULT_CATEGORY = 'all'
API_KEY = "AIzaSyAB9unkt1cak3vRY0_WEmf4UYrYzrHohKM"
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"
QUERY_TERM = "dog"


class Products(ndb.Model):
    name = ndb.StringProperty(indexed=False)
    content = ndb.StringProperty(indexed=False)
    date = ndb.DateTimeProperty(auto_now_add=True)
    exchange = ndb.StringProperty(indexed=False)
    price = ndb.StringProperty(indexed=False)
    connactway = ndb.StringProperty(indexed=False)
    image = ndb.StringProperty(indexed=False)
    category = ndb.StringProperty(indexed=True)
    blob_key = ndb.BlobKeyProperty()


class MainPage(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('index.html')
        self.response.write(template.render())


class ResumePage(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('resume.html')
        self.response.write(template.render())

class DemoPage(webapp2.RequestHandler):
    def get(self):
        temple = JINJA_ENVIRONMENT.get_template('demo.html')
        self.response.write(temple.render())
        
class Demoweather(webapp2.RequestHandler):
    def get(self):
        temple = JINJA_ENVIRONMENT.get_template('weather.html')
        self.response.write(temple.render())

class PhotoUploadFormHandler(webapp2.RequestHandler):
    def get(self):
        upload_url = blobstore.create_upload_url('/upload_photo')
        category = self.request.get('category', DEFAULT_CATEGORY)
        products_query = Products.query(Products.category == category)
        products = products_query.fetch(10)  
        template_values = {
            'products': products,
            'category': urllib.quote_plus(category),
            'upload_url':upload_url,
        }
        template = JINJA_ENVIRONMENT.get_template('product.html')
        self.response.write(template.render(template_values))
        
class PhotoUploadHandler(blobstore_handlers.BlobstoreUploadHandler):
    def post(self):
        try:
           category = self.request.get('category')
           upload = self.get_uploads()[0]
           product = Products(blob_key=upload.key())
           product.category = self.request.get('category')
           product.name = self.request.get('name')
           product.content = self.request.get('content')
           product.exchange = self.request.get('exchange')
           product.price = self.request.get('price')
           product.connactway = self.request.get('connactway')
           product.put()
        except:
            self.error(500)
        finally:
            query_params = {'category': category}
            self.redirect('/goodchange?' + urllib.urlencode(query_params))


class ViewPhotoHandler(blobstore_handlers.BlobstoreDownloadHandler):
    def get(self, photo_key):
        if not blobstore.get(photo_key):
            self.error(404)
        else:
            self.send_blob(photo_key) 
 
      
class SearchResult(webapp2.RequestHandler):
    def get(self):
        videos =[]
        template_values = { 'videos': videos}
        self.response.headers['Content-type'] = 'text/html'
        template = JINJA_ENVIRONMENT.get_template('video.html')
        self.response.write(template.render(template_values))
    
#     def post(self):
#         title=self.request.get('title')
#         search=urllib.quote_plus(title.encode("utf-8"))
#         req = urllib2.Request("https://www.youtube.com/results?search_query="+search)
#         res = urllib2.urlopen(req)
#         data = res.read()
#         reg = r'data-context-item-id="([a-zA-Z0-9].+?)"'
#         videopatten = re.compile(reg)
#         videos = re.findall(videopatten,data)
#         video=[videos[0]]
#         res.close()
#         template_values = { 'videos': video}
#         self.response.headers['Content-type'] = 'text/html'
#         template = JINJA_ENVIRONMENT.get_template('video.html')
#         self.response.write(template.render(template_values))


    
app = webapp2.WSGIApplication([('/', MainPage),
    ('/goodchange', PhotoUploadFormHandler), ('/demo', DemoPage), ('/weather', Demoweather),
    ('/upload_photo', PhotoUploadHandler), ('/view_photo/([^/]+)?', ViewPhotoHandler),('/search', SearchResult), ('/resume', ResumePage), ('/video', SearchResult),
], debug=True)



