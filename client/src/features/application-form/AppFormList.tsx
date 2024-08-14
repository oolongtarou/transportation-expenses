import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import Select, { MultiValue, Options } from 'react-select';

import AppListTable from "./components/AppListTable"
import { ApplicationForm, statusSelectOptions } from "./app-form"
import axios from "axios"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { SearchFormInputs, searchSchema } from "../schema/search-option-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { SelectOption } from "@/components/SelectBox";
import { toNumberArray } from "@/lib/select";


const options: Options<SelectOption> = statusSelectOptions;

const AppFormList = () => {
    const [appForms, setAppForms] = useState<ApplicationForm[]>([]);

    const { setIsLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [selectedOptions, setSelectedOptions] = useState<MultiValue<SelectOption>>([]);
    const handleChange = (selected: MultiValue<SelectOption>) => {
        setSelectedOptions(selected);
    };

    // const fetchAppForms = async () => {
    //     const res = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/app-forms/me`, { workspaceId: 1 }, { withCredentials: true })
    //     const fetchedAppForms: ApplicationForm[] = res.data.appForms;
    //     if (res.data.loggedIn) {
    //         setAppForms(fetchedAppForms);
    //     } else {
    //         setIsLoggedIn(false);
    //         navigate('/');
    //     }
    // };
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SearchFormInputs>({
        mode: 'onChange',
        resolver: zodResolver(searchSchema),
    });

    const onSubmit = async (data: SearchFormInputs) => {
        // console.log(selectedOptions);
        // console.log(toNumberArray(selectedOptions));
        data.status = toNumberArray(selectedOptions);
        // console.log('フォームデータ:', data);
        const res = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/app-forms/me`, { workspaceId: 1, searchOptions: data }, { withCredentials: true })
        window.alert('レスポンスが返ってきました。');
        console.log(res);
        // ここでAPIコールやデータの送信などの処理を行います

        const fetchedAppForms: ApplicationForm[] = res.data.appForms;
        if (res.data.loggedIn) {
            setAppForms(fetchedAppForms);
        } else {
            setIsLoggedIn(false);
            navigate('/');
        }
    };

    return (
        <div className="container">
            <header>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="heading-2">申請一覧</h2>
                    <section className="grid md:grid-cols-2 gap-4 mb-5">
                        <div>
                            <Label htmlFor="applicationIdMin">申請書ID</Label>
                            <div className="flex flex-row items-center gap-3 mt-1">
                                <div className="w-full">
                                    <Input
                                        type="text"
                                        id="applicationIdMin"
                                        placeholder="12345"
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
                                        placeholder="12345"
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
                            <Input id="userName" placeholder="12345" className="mt-1" {...register('userName')} />
                            {errors.userName ? <p className="text-red-500">{errors.userName.message}</p> : null}
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
                                onChange={handleChange}
                                components={{
                                    IndicatorSeparator: () => null,
                                }}
                            />
                        </div>
                    </section>
                    <div className="flex flex-row justify-end gap-5 mb-5">
                        <Button className="btn btn-light w-24">クリア</Button>
                        <Button type="submit" className="btn btn-primary w-24">検索</Button>
                    </div>
                </form>
            </header>
            <main>
                <AppListTable appForms={appForms} className="mb-3" />
                <Pagination>
                    <PaginationContent >
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">4</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">5</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </main>
        </div>
    )
}

export default AppFormList