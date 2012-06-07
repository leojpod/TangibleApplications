module TangiblePicture where


struct Provided where
	show_picture :: Push String

extern make :: String -> String -> Bool -> String -> Class Provided