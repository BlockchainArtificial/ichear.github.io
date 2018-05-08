# PiggyBank

Piggy Bank will help you save money for your purpose. 

It is enough to create a piggy Bank, specify why you need the money and how much in the end. Now you or other people can periodically replenish your piggy Bank and track your progress. You can break the piggy Bank to pick up the accumulated funds


![piggybank](https://github.com/iChear/PiggyBank/blob/master/img/forGithub.png)


You can also disable the withdrawal of funds for a certain period. This protects against the temptation to withdraw money without reaching the goal. For fans of extreme sports made function " burn my money if I do not fulfill the goal."

### Smart contract

- `totalBanks()`

Returns count of created piggy banks.

- `totalBurned()`

Returns count of burned piggy banks.

- `totalBroken()`

Returns count of broken piggy banks.

- `totalUsers()`

Returns count of users.

- `add(curUnixStamp, goal, savingFor, deadline, burn)`

Creates a new piggy bank.

- `get(wallet)`

Кeturns all the piggy banks of the specified wallet.

- `getBurnedBanks(limit, offset)`

Returns burnt piggy banks.

- `putMoney(bankId)`

Makes a Deposit in the piggy Bank.

- `breakup(bankId)`

Breaks the piggy Bank.
