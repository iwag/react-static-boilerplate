require 'net/http'
require 'uri'
require 'json'

#arr = {}
carr = {}

def exe_tag(chars) 
	uri_str = 'http://sug.search.nicovideo.jp/suggestion/complete/' + chars
	response = Net::HTTP.get_response(URI.parse(uri_str))
	t = JSON.parse(response.body)["candidates"].map { |w|
		{tag: w}
	}

	sleep 0.1
	t
end

def exe_con(chars)
#	uri_str = 'http://api.search.nicovideo.jp/api/v2/video/contents/search?fields=contentId,title,thumbnailUrl,communityIcon,startTime,viewCounter,commentCounter&_context=iwag&targets=title&_limit=3&q=' + chars
	uri_str = 'http://api.search.nicovideo.jp/api/v2/live/contents/search?fields=contentId,title,thumbnailUrl,communityIcon,startTime,viewCounter,commentCounter&_context=iwag&targets=title&_limit=4&_sort=startTime&filters%5BliveStatus%5D%5B0%5D=onair&q=' + chars
#	uri_str = 'http://api.search.nicovideo.jp/api/v2/channel/contents/search?fields=contentId,title,thumbnailUrl,startTime&_context=iwag&targets=title,tags&_limit=3&_sort=startTime&q=' + chars
	response = Net::HTTP.get_response(URI.parse(uri_str))
	c = JSON.parse(response.body)

	sleep 0.7
	c
end

for chars in "aa".."zz"

	if chars[0] == chars[1]
#		arr[chars[0]] = exe_tag(chars[0])
		carr[chars[0]] = exe_con(chars[0])
	end
#  arr[chars]  = exe_tag(chars)
  carr[chars]  = exe_con(chars)
end

puts "export default " + JSON.generate(carr)
