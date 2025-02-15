import LoadingSpinner from "@/app/login/verify-request/_components/LoadingSpinner";
import VerifyRequest from "@/app/login/verify-request/_components/verifyRequest";
import { Suspense } from "react";

export default function VerifyRequestPage() {
	return (
		<Suspense fallback={<LoadingSpinner />}>
			<VerifyRequest />
		</Suspense>
	);
}
