import Task = com.google.android.gms.tasks.Task;
import OnSuccessListener = com.google.android.gms.tasks.OnSuccessListener;
import OnFailureListener = com.google.android.gms.tasks.OnFailureListener;

export function promisify(task: Task<any>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        task.addOnSuccessListener(getOnSuccessListener(resolve));
        task.addOnFailureListener(getOnFailureListener(reject));
    });
}

function getOnSuccessListener(onSuccess: () => void) {
    return new OnSuccessListener({
        onSuccess,
    });
}

function getOnFailureListener(onFailure: (e: Error) => void) {
    return new OnFailureListener({
        onFailure(ex: java.lang.Exception) {
            onFailure(new Error(ex.getMessage()));
        },
    });
}
