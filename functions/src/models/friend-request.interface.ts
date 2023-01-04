
export interface FriendRequest{
    inviterId :string,
    inviterName: string,
    invitedId: string,
    invitedName:string,
    processed: boolean,
    declined: boolean,
    created: number
}