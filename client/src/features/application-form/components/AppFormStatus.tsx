import { ApplicationStatuses } from "../app-form";

interface AppFormStatusProps {
    statusId: number
    statusName: string
}

const AppFormStatus = (props: AppFormStatusProps) => {
    const { statusId, statusName } = props;
    return (
        <>
            {statusId === ApplicationStatuses.APPROVING || statusId === ApplicationStatuses.RECEIVING ? (
                <span className="label-fill label-fill-action w-32">{statusName}</span>
            ) : statusId === ApplicationStatuses.RECEIVED ? (
                <span className="label-fill label-fill-success w-32">{statusName}</span>
            ) : (
                <span className="label-fill label-fill-light w-32">{statusName}</span>
            )}
        </>
    )
}

export default AppFormStatus