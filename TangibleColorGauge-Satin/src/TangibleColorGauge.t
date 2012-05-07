module TangibleColorGauge where


struct Provided where
	measurement :: Push Int

extern make :: Int -> Int -> String -> String -> String -> Class Provided