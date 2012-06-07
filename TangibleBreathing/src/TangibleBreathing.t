module TangibleBreathing where


struct Provided where
	start_breathing :: Push ()
	stop_breathing :: Push ()

extern make :: String -> String -> String -> Class Provided