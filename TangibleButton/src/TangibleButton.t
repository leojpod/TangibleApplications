module TangibleButton where


struct Required where
	trigger :: Push ()

extern make :: String -> String ->  Required -> Class ()