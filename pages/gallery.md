---
layout: page
# Parked until there are real photos for it — still the theme's demo content.
# published: false keeps this file but leaves the page out of the build, so it
# is gone from both the nav and its URL. Delete this line to bring it back.
published: false
title: Gallery
subtitle: From the pexels folder
permalink: /gallery/
gallery_path: "assets/img/pexels"
excluded: true
position: 3
tags: [Page]
---

This is a photo gallery made from the static files in the `assets/img/pexels` folder. 
I wanted to automatically create a simple gallery from a folder without having to create a markdown page as you would for the portfolio.


{% include gallery.html gallery_path=page.gallery_path %}
