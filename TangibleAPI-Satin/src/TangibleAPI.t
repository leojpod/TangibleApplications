module TangibleAPI where

import Object

struct Provided where
	api_access :: Pull Object.T
	get_reserved_device :: Pull [String]
	reserve_new_device_sync :: Pull String
	reserve_new_device :: Push ()

extern make :: String -> String -> String -> Class Provided