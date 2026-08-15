import type {
  IEventPairing,
  IEventParticipants,
} from "../../interfaces/event.interface";
import type { IUser } from "../../interfaces/user.interface";

export interface IEventPairingGroup {
  traineeId: string;
  trainee?: IUser;
  pairings: IEventPairing[];
}

export const groupPairingsByTrainee = (
  pairings: IEventPairing[],
): IEventPairingGroup[] => {
  const groups = new Map<string, IEventPairingGroup>();

  pairings.forEach((pairing) => {
    const current = groups.get(pairing.traineeId);
    if (current) {
      current.pairings.push(pairing);
      current.trainee ??= pairing.trainee;
      return;
    }

    groups.set(pairing.traineeId, {
      traineeId: pairing.traineeId,
      trainee: pairing.trainee,
      pairings: [pairing],
    });
  });

  return Array.from(groups.values());
};

export const countUniqueEventParticipants = (
  participants?: IEventParticipants,
) => {
  const userIds = new Set<string>();

  participants?.paired.forEach((pairing) => {
    userIds.add(pairing.mentorId);
    userIds.add(pairing.traineeId);
  });
  participants?.unpairedMentors.forEach((attendee) =>
    userIds.add(attendee.user?.id ?? attendee.userId),
  );
  participants?.unpairedTrainees.forEach((attendee) =>
    userIds.add(attendee.user?.id ?? attendee.userId),
  );

  return userIds.size;
};
