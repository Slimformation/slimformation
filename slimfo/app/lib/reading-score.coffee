Lexer = require 'lib/lexer'

# returns syllable count
# http://stackoverflow.com/questions/1271918/ruby-count-syllables
newCount = (word) ->
  word = word.toLowerCase() #word.downcase!
  return 1  if word.length <= 3 #return 1 if word.length <= 3
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "") #word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  word = word.replace(/^y/, "") #word.sub!(/^y/, '')
  word.match(/[aeiouy]{1,2}/g).length #word.scan(/[aeiouy]{1,2}/).size

ReadingScore =
  numSyllables: (text) ->
    words = (new Lexer).lex text
    count = _.reduce words, ((memo, word) -> memo + newCount(word)), 0

# console.log (new Lexer).lex("This is some example text! How did it do on lexing?")
console.log ReadingScore.numSyllables("why the lucky stiff")

module.exports = ReadingScore