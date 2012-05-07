module TangibleColorDisplay where


struct Provided where
	color :: Push String

extern make :: String -> Class Provided