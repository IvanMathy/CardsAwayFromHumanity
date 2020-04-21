const cardsCount = 300

export class Deck {

    discardPile: number[] = []
    cardsInPlay = new Set<number>()
    cards: number[]

    constructor() {
        let cards: number[] = []

        for (var i = 0; i < cardsCount; i++) {
            cards.push(i);
        }

        this.cards = this.shuffle(cards)
    }

    private shuffle(cardIn: number[]): number[] {

        let cards = cardIn

        // Bootleg Fisher–Yates 
        for (let from = cards.length - 1; from > 0; from--) {
            const to = Math.floor(Math.random() * (from + 1));
            [cards[to], cards[from]] = [cards[from], cards[to]];
        }

        return cards
    }

    pickCard(): number {

        let card = this.cards.shift()

        if(card == undefined) {
            // Pile empty, reuse cards.
            this.cards = this.shuffle(this.discardPile)
            card = this.cards.shift() ?? -1
        }

        this.cardsInPlay.add(card)

        return card
    }

    pickCards(count: number): number[] {
        let hand: number[] = []

        for (var i = 1; i < count; i++) {
            hand.push(this.pickCard())
        }

        return hand
    }

    getBlackCard(): number {
        return 0
    }

    discard(card: number){
        if(this.cardsInPlay.has(card)) {
            this.cardsInPlay.delete(card)
            this.discardPile.push(card)
        }
    }
}