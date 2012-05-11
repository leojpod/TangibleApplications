module TangibleNeighbor where


struct Required where
	onNeighbor :: Push ()

extern make :: String -> String -> String -> String -> Required -> Class ()