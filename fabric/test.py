def test(nums: list[int]):
    if len(nums) == 1:
        return True
    for i in range(1, len(nums)):
        if nums[i] % 2 != 0 and nums[i - 1] % 2 != 0:
            return False
    return True


print(test([2, 10]))
