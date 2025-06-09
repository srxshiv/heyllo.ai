import { useParams } from "next/navigation";


const Page = async () => {
    const { id } = useParams<{ id: string }>();

    return (
        <>
            <h3>Interview Page</h3>
        </>
    );
}