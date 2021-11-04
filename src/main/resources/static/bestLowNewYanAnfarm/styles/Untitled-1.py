import HTMLParser
 
def decodeHtml(input):
    h = HTMLParser.HTMLParser()
    s = h.unescape(input)
    print(s)
 
decodeHtml('&#38451;&#38175;')
