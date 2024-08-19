import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Select, { MultiValue, Options, SingleValue } from 'react-select';

import AppListTable from "./components/AppListTable"
import { ApplicationForm, statusSelectOptions } from "./app-form"
import axios from "axios"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { SearchFormInputs, searchSchema } from "../schema/search-option-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/lib/auth";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { SelectOption } from "@/components/SelectBox";
import { toNumberArray } from "@/lib/select";
import { CustomPagination } from "@/components/Pagination";
import { getWorkspaceIdFrom } from "@/lib/user-workspace";
import { waitFor } from "@/lib/utils";
import MessageBox from "@/components/MessageBox";

type AppFormListType = 'me' | 'approver';

interface AppFormListProps {
    appFormListType: AppFormListType
}

const options: Options<SelectOption> = statusSelectOptions;

const numberOfItemsOptions: SelectOption[] = [
    { value: "20", label: "20" },
    { value: "50", label: "50" },
    { value: "100", label: "100" },
];

const AppFormList = (props: AppFormListProps) => {
    const { appFormListType } = props;
    const workspaceId = getWorkspaceIdFrom(useLocation().pathname);
    const [appForms, setAppForms] = useState<ApplicationForm[]>([]);
    const [total, setTotal] = useState<number>(0);  // total stateを追加
    const { setIsLoggedIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedOptions, setSelectedOptions] = useState<MultiValue<SelectOption>>([]);
    const [numberOfItems, setNumberOfItems] = useState<SingleValue<SelectOption>>(numberOfItemsOptions[0]);
    const [isLoading, setLoading] = useState(true);
    const currentPage = Number(searchParams.get('page') ?? '1');
    const currentWorkSpace = getWorkspaceIdFrom(location.pathname);
    const [messageCode, setMessageCode] = useState<string>('');
    const onStatusOptionChanged = (selected: MultiValue<SelectOption>) => {
        setSelectedOptions(selected);
    };

    const onNumberOfItemsChanged = (selected: SingleValue<SelectOption>) => {
        setNumberOfItems(selected);
        const currentSearchOptions = watch();
        currentSearchOptions.status = toNumberArray(selectedOptions);
        currentSearchOptions.numberOfItems = Number(selected?.value ?? 20);
        fetchData(1, currentSearchOptions);
        const url = appFormListType === 'me'
            ? `/w/${currentWorkSpace}/app-form/list/me?page=1`
            : appFormListType === 'approver'
                ? `/w/${currentWorkSpace}/app-form/list/approver?page=1`
                : '';
        navigate(url);
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm<SearchFormInputs>({
        mode: 'onChange',
        resolver: zodResolver(searchSchema),
    });

    // データを取得する関数
    const fetchData = async (page: number, searchOptions: SearchFormInputs) => {
        try {
            const endPoint = appFormListType === 'me'
                ? `${import.meta.env.VITE_SERVER_DOMAIN}/app-forms/me`
                : appFormListType === 'approver'
                    ? `${import.meta.env.VITE_SERVER_DOMAIN}/app-forms/approver`
                    : '';

            const res = await axios.post(endPoint, {
                workspaceId: workspaceId ?? 0,
                page: page,
                searchOptions: searchOptions
            }, { withCredentials: true });

            const fetchedAppForms: ApplicationForm[] = res.data.appForms;
            setTotal(res.data.count);  // totalをセット

            if (res.data.loggedIn) {
                await waitFor(3);
                setAppForms(fetchedAppForms);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setLoading(false);
            } else {
                setIsLoggedIn(false);
                navigate('/');
            }
        } catch (error) {
            console.error("データの取得に失敗しました", error);
            setMessageCode('E00001');
        }
    };

    const getCurrentSearchOptions = (): SearchFormInputs => {
        const currentSearchOptions = watch();
        currentSearchOptions.status = toNumberArray(selectedOptions);
        currentSearchOptions.numberOfItems = Number(numberOfItems?.value);
        return currentSearchOptions;
    }

    // 初回レンダリング時にデータを取得
    useEffect(() => {
        fetchData(currentPage, getCurrentSearchOptions());
    }, [currentPage, navigate, setIsLoggedIn]);

    const onSubmit = async (data: SearchFormInputs) => {
        data.status = toNumberArray(selectedOptions);
        data.numberOfItems = Number(numberOfItems?.value);
        fetchData(1, data);  // 検索フォーム送信時は1ページ目を取得
    };

    const handlePageChange = (page: number) => {
        setSearchParams({ page: page.toString() });  // URLのクエリを更新
        fetchData(page, getCurrentSearchOptions());  // ページ変更時にデータを再取得
    };

    const clearSearchOptions = () => {
        reset();
        setSelectedOptions([]);
    }

    return (
        <div className="container">
            <MessageBox messageCode={messageCode} />
            <header>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="heading-2">
                        {appFormListType === 'me'
                            ? '申請一覧'
                            : appFormListType === 'approver'
                                ? '承認一覧'
                                : ''
                        }
                    </h2>
                    <section className="grid md:grid-cols-2 gap-4 mb-5">
                        <div>
                            <Label htmlFor="applicationIdMin">申請書ID</Label>
                            <div className="flex flex-row items-center gap-3 mt-1">
                                <div className="w-full">
                                    <Input
                                        type="text"
                                        id="applicationIdMin"
                                        {...register('applicationIdMin', {
                                            onChange: (e) => {
                                                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                            }
                                        })}
                                    />
                                </div>
                                <span>～</span>
                                <div className="w-full">
                                    <Input
                                        type="text"
                                        id="applicationIdMax"
                                        {...register('applicationIdMax', {
                                            onChange: (e) => {
                                                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                            }
                                        })} />
                                </div>
                            </div>

                            {errors.applicationIdMin || errors.applicationIdMax
                                ?
                                <>
                                    <div className="flex flex-row items-center gap-3 mt-1">
                                        <div className="w-full">
                                            {errors.applicationIdMin ? <p className="text-red-500">{errors.applicationIdMin.message}</p> : null}
                                        </div>
                                        <span>&emsp;</span>
                                        <div className="w-full">
                                            {errors.applicationIdMax ? <p className="text-red-500">{errors.applicationIdMax.message}</p> : null}
                                        </div>
                                    </div>
                                </>
                                : <></>
                            }
                        </div>
                        <div>
                            <Label htmlFor="startDate">申請日</Label>
                            <div className="flex flex-row items-center gap-3 mt-1">
                                <div className="w-full">
                                    <Input type="date" id="startDate" placeholder="12345" {...register('startDate')} />
                                </div>
                                <span>～</span>
                                <div className="w-full">
                                    <Input type="date" id="endDate" placeholder="12345" {...register('endDate')} />
                                </div>
                            </div>
                            {errors.startDate || errors.endDate
                                ?
                                <>
                                    <div className="flex flex-row items-center gap-3 mt-1">
                                        <div className="w-full">
                                            {errors.startDate ? <p className="text-red-500">{errors.startDate.message}</p> : null}
                                        </div>
                                        <span>&emsp;</span>
                                        <div className="w-full">
                                            {errors.endDate ? <p className="text-red-500">{errors.endDate.message}</p> : null}
                                        </div>
                                    </div>
                                </>
                                : <></>
                            }
                        </div>
                        <div>
                            <Label htmlFor="userName">申請者名</Label>
                            <Input id="userName" className="mt-1" {...register('userName')} />
                            {errors.userName ? <p className="text-red-500">{errors.userName.message}</p> : null}
                        </div>
                        <div>
                            <Label htmlFor="title">タイトル</Label>
                            <Input id="title" className="mt-1" {...register('title')} />
                            {errors.title ? <p className="text-red-500">{errors.title.message}</p> : null}
                        </div>
                        <div>
                            <Label htmlFor="totalAmountMin">金額</Label>
                            <div className="flex flex-row items-center gap-3 mt-1">
                                <div className="w-full">
                                    <Input
                                        id="totalAmountMin"
                                        placeholder=""
                                        {...register('totalAmountMin', {
                                            onChange: (e) => {
                                                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                            }
                                        })}
                                    />
                                </div>
                                <span>～</span>
                                <div className="w-full">
                                    <Input
                                        id="totalAmountMax"
                                        maxLength={1000000}
                                        {...register('totalAmountMax', {
                                            onChange: (e) => {
                                                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                            }
                                        })}
                                    />
                                </div>
                            </div>
                            {errors.totalAmountMin || errors.totalAmountMax
                                ?
                                <>
                                    <div className="flex flex-row items-center gap-3 mt-1">
                                        <div className="w-full">
                                            {errors.totalAmountMin ? <p className="text-red-500">{errors.totalAmountMin.message}</p> : null}
                                        </div>
                                        <span>&emsp;</span>
                                        <div className="w-full">
                                            {errors.totalAmountMax ? <p className="text-red-500">{errors.totalAmountMax.message}</p> : null}
                                        </div>
                                    </div>
                                </>
                                : <></>
                            }
                        </div>
                        <div>
                            <Label htmlFor="applicationStatus">申請書ステータス</Label>
                            <Select
                                id="applicationStatus"
                                isClearable
                                isMulti
                                options={options}
                                value={selectedOptions}
                                onChange={onStatusOptionChanged}
                                components={{
                                    IndicatorSeparator: () => null,
                                }}
                            />
                        </div>
                    </section>
                    <div className="flex flex-row justify-between gap-5">
                        <div className="flex items-center">
                            <Label htmlFor="numberOfItems" className="">表示件数：</Label>
                            <Select
                                id="numberOfItems"
                                options={numberOfItemsOptions}
                                defaultValue={numberOfItems}
                                isSearchable={false}
                                onChange={onNumberOfItemsChanged}
                                components={{
                                    IndicatorSeparator: () => null,
                                }}
                            />
                        </div>
                        <div className="flex items-center gap-5">
                            <p>{currentPage * Number(numberOfItems?.value) - Number(numberOfItems?.value) + 1}-{currentPage * Number(numberOfItems?.value) >= total ? total : currentPage * Number(numberOfItems?.value)} ({total}件中)</p>
                            <Button type="button" onClick={clearSearchOptions} className="btn btn-light w-24">クリア</Button>
                            <Button type="submit" className="btn btn-primary w-24">検索</Button>

                        </div>
                    </div>
                </form>
            </header>
            <main>
                <AppListTable appForms={appForms} className="mb-3" isLoading={isLoading} />
                <CustomPagination currentPage={currentPage} total={total} itemsPerPage={Number(numberOfItems?.value)} onPageChange={handlePageChange} />
            </main>
        </div>
    )
}

export default AppFormList