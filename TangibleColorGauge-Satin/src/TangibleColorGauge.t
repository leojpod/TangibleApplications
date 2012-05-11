module TangibleColorGauge where


struct Provided where
	measurement :: Push String

extern make :: String -> Int -> Int -> String -> String -> String -> Class Provided