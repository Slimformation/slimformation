{ exec } = require 'child_process'

puts = (error, stdout, stderr) ->
  console.log(stdout)

# require the particular file we're testing
background = require '../../app/background/scripts/coffee/background'

describe "tautology", ->
  it "should be equal to 1", ->
    1.should.equal 1

describe "foo is foo", ->
  it "should be foo", ->
    foo = background.foo
    foo().should.equal "foo"