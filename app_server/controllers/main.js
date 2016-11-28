var request = require('request');
var maxmind = require('maxmind');
var apiOptions = {
  server: process.env.LOCAL_SERVER
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = process.env.REMOTE_SERVER;
}

/* get country code */
var getCountry = function (req, res, getPage) {
  maxmind.open('./app_server/geodb/country.mmdb', function (err, countryLookup) {
    if (err) {
      renderError(req, res, err);
    } else {
      var userCountry = countryLookup.get(req.ip);
      if (userCountry) {
        var countryArr = process.env.COUNTRIES.split(',');
        userCountry = userCountry.country.iso_code.toLowerCase();
        for (var i = 0; i < countryArr.length; i++) {
          if (countryArr[i] === userCountry) {
            getPage(req, res, userCountry);
            return;
          }
        }
      }
      getPage(req, res, 'others');
    }
  });
};

var _showError = function (req, res, status) {
  var title, content;
  if (status === 404) {
    title = '404, page not found';
    content = 'Looks like we can\'t find this page. Sorry.';
  } else {
    title = status + ', something\'s went wrong';
    content = 'Something, somewhere, has gone just a little bit wrong.';
  }
  res.status(status);
  res.render('generic-text', {
    pageHead: {
      titleHtml: title + ' | BookScorpion.org'
    },
    title: title,
    text: content
  });
};

/* render error page for home page API error */
var renderError = function (req, res, message) {
  res.render('generic-text', {
    pageHead: {
      titleHtml: 'Error | BookScorpion.org'
    },
    title: 'Error',
    text: message
  });
};

/* render home page */
var renderHomepage = function (req, res, responseBody, userCountry) {
  if (!(responseBody instanceof Array)) {
    renderError(req, res, 'API lookup error');
  } else if (!responseBody.length) {
    renderError(req, res, 'No books found');
  } else {
    res.render('index', {
      pageHead: {
        titleHtml: 'BookScorpion.org - Your #1 Source for Daily Book Deals'
      },
      books: responseBody,
      country: userCountry
    });
  }
};

/* get homepage data */
var getHomepage = function (req, res, country) {
  var requestOptions, path;
  path = '/api/books';
  requestOptions = {
    url: apiOptions.server + path,
    json: {}
  };
  request(requestOptions, function (err, response, body) {
    if (response.statusCode === 200) {
      renderHomepage(req, res, body, country);
    } else {
      _showError(req, res, response.statusCode);
    }
  });
};

/* home page entry */
module.exports.home = function (req, res) {
  getCountry(req, res, getHomepage);
};

/* render book detail page */
var renderBookpage = function (req, res, responseBody, userCountry) {
  res.render('book', {
    pageHead: {
      titleHtml: responseBody.nameLong + ' | BookScorpion.org'
    },
    book: responseBody,
    country: userCountry
  });
};

/* get book detail page data */
var getBookpage = function (req, res, country) {
  var requestOptions, path;
  path = '/api/books/' + req.params.bookname;
  requestOptions = {
    url: apiOptions.server + path,
    json: {}
  };
  request(requestOptions, function (err, response, body) {
    if (response.statusCode === 200) {
      renderBookpage(req, res, body, country);
    } else {
      _showError(req, res, response.statusCode);
    }
  });
};

/* book detail page entry */
module.exports.book = function (req, res) {
  getCountry(req, res, getBookpage);
};

/* GET privacy policy page */
module.exports.privacy = function (req, res) {
  res.render('generic-text', {
    pageHead: {
      titleHtml: 'Privacy Policy | BookScorpion.org'
    },
    title: 'Privacy Policy',
    text: 'This Privacy Policy governs the manner in which BookScorpion collects, uses, maintains and discloses information collected from users (each, a "User") of the http://www.bookscorpion.org/ website ("Site"). This privacy policy applies to the Site and all products and services offered by BookScorpion.<br><br><strong>Personal identification information</strong><br><br>We may collect personal identification information from Users in a variety of ways in connection with activities, services, features or resources we make available on our Site.. Users may visit our Site anonymously. We will collect personal identification information from Users only if they voluntarily submit such information to us. Users can always refuse to supply personally identification information, except that it may prevent them from engaging in certain Site related activities.<br><br><strong>Non-personal identification information</strong><br><br>We may collect non-personal identification information about Users whenever they interact with our Site. Non-personal identification information may include the browser name, the type of computer and technical information about Users means of connection to our Site, such as the operating system and the Internet service providers utilized and other similar information.<br><br><strong>Web browser cookies</strong><br><br>Our Site may use "cookies" to enhance User experience. User\'s web browser places cookies on their hard drive for record-keeping purposes and sometimes to track information about them. User may choose to set their web browser to refuse cookies, or to alert you when cookies are being sent. If they do so, note that some parts of the Site may not function properly.<br><br><strong>How we use collected information</strong><br><br>BookScorpion may collect and use Users personal information for the following purposes:<br>- To improve our Site<br>We may use feedback you provide to improve our products and services.<br><br><strong>How we protect your information</strong><br><br>We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information, username, password, transaction information and data stored on our Site.<br><br><strong>Sharing your personal information</strong><br><br>We do not sell, trade, or rent Users personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates and advertisers for the purposes outlined above.<br><br><strong>Third party websites</strong><br><br>Users may find advertising or other content on our Site that link to the sites and services of our partners, suppliers, advertisers, sponsors, licensors and other third parties. We do not control the content or links that appear on these sites and are not responsible for the practices employed by websites linked to or from our Site. In addition, these sites or services, including their content and links, may be constantly changing. These sites and services may have their own privacy policies and customer service policies. Browsing and interaction on any other website, including websites which have a link to our Site, is subject to that website\'s own terms and policies.<br><br><strong>Advertising</strong><br><br>Ads appearing on our site may be delivered to Users by advertising partners, who may set cookies. These cookies allow the ad server to recognize your computer each time they send you an online advertisement to compile non personal identification information about you or others who use your computer. This information allows ad networks to, among other things, deliver targeted advertisements that they believe will be of most interest to you. This privacy policy does not cover the use of cookies by any advertisers.<br><br><strong>Changes to this privacy policy</strong><br><br>BookScorpion has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the bottom of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect. You acknowledge and agree that it is your responsibility to review this privacy policy periodically and become aware of modifications.<br><br><strong>Your acceptance of these terms</strong><br><br>By using this Site, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our Site. Your continued use of the Site following the posting of changes to this policy will be deemed your acceptance of those changes.<br><br><strong>Contacting us</strong><br><br>If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at:<br>BookScorpion<br>http://www.bookscorpion.org/<br><br>This document was last updated on June 04, 2016.'
  });
};