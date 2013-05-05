#!
# * jsPOS
# *
# * Copyright 2010, Percy Wegmann
# * Licensed under the GNU LGPLv3 license
# * http://www.opensource.org/licenses/lgpl-3.0.html
# *
# * (translated to CoffeeScript by Gursimran Singh, 2013)
# 

re =
  url: /\b(?:(?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\))+(?:\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/g
  number: /[0-9]*\.[0-9]+|[0-9]+/g
  space: /\s+/g
  unblank: /\S/
  punctuation: /[\/\.\,\?\!]/g


module.exports = class Lexer  
  
  regexs: [re.url, re.number, re.space, re.punctuation]

  lex: (string) ->
    array = []
    node = new LexerNode(string, @regexs[0], @regexs.slice(1))
    node.fillArray array
    array

# http://daringfireball.net/2010/07/improved_regex_for_matching_urls
class LexerNode
  constructor: (string, regex, regexs) ->
    @string = string
    @children = []
    if string
      @matches = string.match(regex)
      childElements = string.split(regex)
    unless @matches
      @matches = []
      childElements = [string]
    unless regexs.length
      # no more regular expressions, we're done
      @children = childElements
    else
      # descend recursively
      nextRegex = regexs[0]
      nextRegexes = regexs.slice(1)
      for i of childElements
        @children.push new LexerNode(childElements[i], nextRegex, nextRegexes)

  fillArray: (array) ->
    for i of @children
      child = @children[i]
      if child.fillArray
        child.fillArray array
      else array.push child  if re.unblank.test(child)
      if i < @matches.length
        match = @matches[i]
        array.push match  if re.unblank.test(match)

  toString: ->
    array = []
    @fillArray array
    array.toString()
