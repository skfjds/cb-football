import { connect } from "@/app/modals/dbConfig";
import { TRANSACTION } from "@/app/modals/modal";
import WithdrawCard from "../adminComponents/Withdrawal/WithdrawalCard";
import Search from "../adminComponents/Search/Search";

const Page = async ({ searchParams }) => {
    let data = [];
    data = await getAllTransactions();

    return (
        <div className="bg-red-100  pb-8  ">
            <div className="text-center py-4">
                <h1>Withdraw</h1>
            </div>
            <Search from={"withdraw"} />
            <div className="rounded-xl py-1 mx-auto w-[95%] mt-6 bg-[#ffff]">
                <div className="py-2 px-3">
                    <h1 className="font-bold text-sm">
                        UPI/USDT Withdrawal request
                    </h1>
                </div>
                <div className=" space-y-2 divide-gray-300">
                    {(data || []).map((ele, idx) => {
                        if (
                            searchParams?.search &&
                            ele?.Bank.AccNumber?.toString()?.startsWith(
                                searchParams?.search
                            )
                        ) {
                            return (
                                <WithdrawCard
                                    idx={idx}
                                    key={idx}
                                    data={JSON.parse(JSON.stringify(ele))}
                                />
                            );
                        } else if (!searchParams?.search) {
                            return (
                                <WithdrawCard
                                    idx={idx}
                                    key={idx}
                                    data={JSON.parse(JSON.stringify(ele))}
                                />
                            );
                        }
                    })}
                </div>
            </div>
        </div>
    );
};

export default Page;

async function getAllTransactions() {
    "use server";
    try {
        await connect();

        // Get the current date
        const today = new Date(
            new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kolkata",
            })
        );
        const todayDateString = formatDate(today);

        // Calculate the dates for yesterday and the day before yesterday
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayDateString = formatDate(yesterday);

        const dayBeforeYesterday = new Date(today);
        dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
        const dayBeforeYesterdayDateString = formatDate(dayBeforeYesterday);

        // Fetch transactions for the last three days
        const data = await TRANSACTION.find({
            Type: "withdrawal",
            Date: {
                $in: [
                    todayDateString,
                    yesterdayDateString,
                    dayBeforeYesterdayDateString,
                ],
            },
        }).sort({ createdAt: -1 });

        return data;
    } catch (error) {
        console.log(error);
    }
}
function formatDate(date) {
    const day = String(date.getDate());
    const month = String(date.getMonth() + 1); // January is 0!
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
export const dynamic = "force-dynamic";
