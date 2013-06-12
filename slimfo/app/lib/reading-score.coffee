Lexer = require 'lib/lexer'

class ReadingScore
  constructor: (text) ->
    @words = (new Lexer).lex text

  # returns syllable count
  # http://stackoverflow.com/questions/1271918/ruby-count-syllables
  newCount: (word) ->
    word = word.toLowerCase() #word.downcase!
    return 1  if word.length <= 3 #return 1 if word.length <= 3
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "") #word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
    word = word.replace(/^y/, "") #word.sub!(/^y/, '')
    word = word.replace(/[0-9]+/,"")
    w = word.match(/[aeiouy]{1,2}/g)
    if w
      w.length
    else
      0

  numSyllables: () ->
    count = _.reduce @words, ((memo, word) -> memo + @newCount(word)), 0, this

  numSentences: () ->
    _.filter(@words, ((word)-> /[.?!]/.test(word))).length

  numWords: () ->
    @words.length - @numSentences.length

  fleschKincaid: () ->
    numWords = @numWords()
    206.835 - 1.015*(numWords/@numSentences()) - 84.6*(@numSyllables()/numWords)

# example
# text = "Once there were three tribes. The Optimists, whose patron saints were Drake and Sagan, believed in a universe crawling with gentle intelligence—spiritual brethren vaster and more enlightened than we, a great galactic siblinghood into whose ranks we would someday ascend. Surely, said the Optimists, space travel implies enlightenment, for it requires the control of great destructive energies. Any race which can't rise above its own brutal instincts will wipe itself out long before it learns to bridge the interstellar gulf.
# Across from the Optimists sat the Pessimists, who genuflected before graven images of Saint Fermi and a host of lesser lightweights. The Pessimists envisioned a lonely universe full of dead rocks and prokaryotic slime. The odds are just too low, they insisted. Too many rogues, too much radiation, too much eccentricity in too many orbits. It is a surpassing miracle that even one Earth exists; to hope for many is to abandon reason and embrace religious mania. After all, the universe is fourteen billion years old: if the galaxy were alive with intelligence, wouldn't it be here by now?
# Equidistant to the other two tribes sat the Historians. They didn't have too many thoughts on the probable prevalence of intelligent, spacefaring extraterrestrials— but if there are any, they said, they're not just going to be smart. They're going to be mean."
# console.log text
# console.log (new ReadingScore(text)).fleschKincaid()

module.exports = ReadingScore
