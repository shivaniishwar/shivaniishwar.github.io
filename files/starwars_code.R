library(dplyr)
library(stringr)
library(tidyverse)
library(tidytext)
library(ggplot2)
library(tm)
library(topicmodels)
library(data.table)
library(ggthemes)
library(wordcloud)
library(RColorBrewer)

#basic data cleaning

sw4 <- read.csv("~/Desktop/SW_EpisodeIV.csv",stringsAsFactors=FALSE)
sw5 <- read.csv("~/Desktop/SW_EpisodeV.csv",stringsAsFactors=FALSE)
sw6 <- read.csv("~/Desktop/SW_EpisodeVI.csv",stringsAsFactors=FALSE)

sw4$X <- "4"
sw5$X <- "5"
sw6$X <- "6"

sw <- rbind(sw4,sw5,sw6)
names(sw) <- c("movie","character","dialogue")

glimpse(sw)
summary(sw)

#sentiment analysis

get_sentiments("afinn")
get_sentiments("nrc")

sw_tidy <- sw %>% ungroup() %>% unnest_tokens(word,dialogue)

nrc_joy <- get_sentiments("nrc") %>% filter(sentiment=="joy")
nrc_sad <- get_sentiments("nrc") %>% filter(sentiment=="sadness")
nrc_anger <- get_sentiments("nrc") %>% filter(sentiment=="anger")
nrc_trust <- get_sentiments("nrc") %>% filter(sentiment=="trust")
nrc_fear <- get_sentiments("nrc") %>% filter(sentiment=="fear")
nrc_pos <- get_sentiments("nrc") %>% filter(sentiment=="positive")
nrc_neg <- get_sentiments("nrc") %>% filter(sentiment=="negative")

sw_joy <- sw_tidy %>% inner_join(nrc_joy) %>% dplyr::count(word, sort=TRUE)
#returns 101 instances
sw_sadness <- sw_tidy %>% inner_join(nrc_sad) %>% dplyr::count(word, sort=TRUE)
#"wan" like in "obi wan" comes up as a sad word!
#not counting those, returns 99 instances
sw_anger <- sw_tidy %>% inner_join(nrc_anger) %>% dplyr::count(word,sort=TRUE)
#"force" comes up as an angry word! oops!
#not counting those, returns 75 instances
sw_trust <- sw_tidy %>% inner_join(nrc_trust) %>% dplyr::count(word,sort=TRUE)
#returns 192 instances
sw_fear <- sw_tidy %>% inner_join(nrc_fear) %>% dplyr::count(word,sort=TRUE)
#"force," "obi," and "wan" come up as fearful words!
#not counting those, returns 60 instances
sw_pos <- sw_tidy %>% inner_join(nrc_pos) %>% dplyr::count(word,sort=TRUE)
#returns 319 instances
sw_neg <- sw_tidy %>% inner_join(nrc_neg) %>% dplyr::count(word,sort=TRUE)
#not counting "force," "obi," or "wan," returns 173 instances

sum(sw_joy$n) #returns 496
sum(sw_sadness$n) #returns 472
sum(sw_anger$n) #returns 503
sum(sw_trust$n) #returns 988
sum(sw_fear$n) #returns 703
sum(sw_pos$n) #returns 1401
sum(sw_neg$n) #returns 1121

sw_sent <- sw_tidy %>% inner_join(get_sentiments("afinn"))
#afinn does not count "force," "obi," or "wan" as negative words! hooray!
sw_score <- sum(sw_sent$value) #returns 112

#individual characters

luke <- sw[which(sw$character=="LUKE"),]
han <- sw[which(sw$character=="HAN"),]
leia <- sw[which(sw$character=="LEIA"),]
vader <- sw[which(sw$character=="VADER"),]
threepio <- sw[which(sw$character=="THREEPIO"),]
obiwan <- sw[which(sw$character=="BEN"),]
lando <- sw[which(sw$character=="LANDO"),]

#note: vader is the only bad guy with over 50 lines.
#i chose corpora where the character has over 50 lines.
#funnily, after lando (101 lines), the next is yoda (49 lines).
#so all my corpora have >100 lines.

luke_tidy <- luke %>% ungroup() %>% unnest_tokens(word,dialogue)
han_tidy <- han %>% ungroup() %>% unnest_tokens(word,dialogue)
leia_tidy <- leia %>% ungroup() %>% unnest_tokens(word,dialogue)
vader_tidy <- vader %>% ungroup() %>% unnest_tokens(word,dialogue)
threepio_tidy <- threepio %>% ungroup() %>% unnest_tokens(word,dialogue)
obiwan_tidy <- obiwan %>% ungroup() %>% unnest_tokens(word,dialogue)
lando_tidy <- lando %>% ungroup() %>% unnest_tokens(word,dialogue)

luke_sent <- luke_tidy %>% inner_join(get_sentiments("afinn"))
luke_score <- sum(luke_sent$value) #returns 16
han_sent <- han_tidy %>% inner_join(get_sentiments("afinn"))
han_score <- sum(han_sent$value) #returns 137
leia_sent <- leia_tidy %>% inner_join(get_sentiments("afinn"))
leia_score <- sum(leia_sent$value) #returns 18
vader_sent <- vader_tidy %>% inner_join(get_sentiments("afinn"))
vader_score <- sum(vader_sent$value) #returns -14
threepio_sent <- threepio_tidy %>% inner_join(get_sentiments("afinn"))
threepio_score <- sum(threepio_sent$value) #returns 33
obiwan_sent <- obiwan_tidy %>% inner_join(get_sentiments("afinn"))
obiwan_score <- sum(obiwan_sent$value) #returns -4
lando_sent <- lando_tidy %>% inner_join(get_sentiments("afinn"))
lando_score <- sum(lando_sent$value) #returns 28

#word frequency

sw_stops <- c(stopwords("en"),"got","will","dont","will","cant","can","youre",
              "thats","yes","sir","going","hes","get","ill","theyre","theres",
              "didnt","whats")

luke_freq <- luke_tidy
luke_freq$word <- luke_freq$word %>% removeWords(sw_stops)
luke_freq <- na.omit(luke_freq)
luke_freq <- luke_freq %>% count(word,sort=TRUE)
luke_freq <- luke_freq[-c(1),]

han_freq <- han_tidy
han_freq$word <- han_freq$word %>% removeWords(sw_stops)
han_freq <- na.omit(han_freq)
han_freq <- han_freq %>% count(word,sort=TRUE)
han_freq <- han_freq[-c(1),]

leia_freq <- leia_tidy
leia_freq$word <- leia_freq$word %>% removeWords(sw_stops)
leia_freq <- na.omit(leia_freq)
leia_freq <- leia_freq %>% count(word,sort=TRUE)
leia_freq <- leia_freq[-c(1),]

vader_freq <- vader_tidy
vader_freq$word <- vader_freq$word %>% removeWords(sw_stops)
vader_freq <- na.omit(vader_freq)
vader_freq <- vader_freq %>% count(word,sort=TRUE)
vader_freq <- vader_freq[-c(1),]

threepio_freq <- threepio_tidy
threepio_freq$word <- threepio_freq$word %>% removeWords(sw_stops)
threepio_freq <- na.omit(threepio_freq)
threepio_freq <- threepio_freq %>% count(word,sort=TRUE)
threepio_freq <- threepio_freq[-c(1),]

obiwan_freq <- obiwan_tidy
obiwan_freq$word <- obiwan_freq$word %>% removeWords(sw_stops)
obiwan_freq <- na.omit(obiwan_freq)
obiwan_freq <- obiwan_freq %>% count(word,sort=TRUE)
obiwan_freq <- obiwan_freq[-c(1),]

lando_freq <- lando_tidy
lando_freq$word <- lando_freq$word %>% removeWords(sw_stops)
lando_freq <- na.omit(lando_freq)
lando_freq <- lando_freq %>% count(word,sort=TRUE)
lando_freq <- lando_freq[-c(1),]

#transforming into corpora

sw_corpus <- VCorpus(VectorSource(sw$dialogue))

luke_corpus <- VCorpus(VectorSource(luke$dialogue))
han_corpus <- VCorpus(VectorSource(han$dialogue))
leia_corpus <- VCorpus(VectorSource(leia$dialogue))
vader_corpus <- VCorpus(VectorSource(vader$dialogue))
threepio_corpus <- VCorpus(VectorSource(threepio$dialogue))
obiwan_corpus <- VCorpus(VectorSource(obiwan$dialogue))
lando_corpus <- VCorpus(VectorSource(lando$dialogue))

#cleaning main corpus

sw_clean <- tm_map(sw_corpus, removeNumbers)
sw_clean <- tm_map(sw_clean, removePunctuation)
sw_clean <- tm_map(sw_clean, stripWhitespace)
sw_clean <- tm_map(sw_clean, content_transformer(tolower))
sw_clean <- tm_map(sw_clean, removeWords, sw_stops)

#topic modeling

sw_dtm <- DocumentTermMatrix(sw_clean)
unique_indexes <- unique(sw_dtm$i)
sw_dtm <- sw_dtm[unique_indexes,]

k <- 4
sw_lda <- LDA(sw_dtm,k=k,control=list(seed=1234))
sw_lda_words <- terms(sw_lda,5)
sw_lda_tidy <- tidy(sw_lda)

sw_top_terms <- sw_lda_tidy %>% group_by(topic) %>% top_n(5,beta) %>%
  ungroup() %>% arrange(topic, -beta)

#repeated process for smaller corpora

luke_clean <- tm_map(luke_corpus, removeNumbers)
luke_clean <- tm_map(luke_clean, removePunctuation)
luke_clean <- tm_map(luke_clean, stripWhitespace)
luke_clean <- tm_map(luke_clean, content_transformer(tolower))
luke_clean <- tm_map(luke_clean, removeWords, sw_stops)

luke_dtm <- DocumentTermMatrix(luke_clean)
unique_luke <- unique(luke_dtm$i)
luke_dtm <- luke_dtm[unique_luke,]

luke_lda <- LDA(luke_dtm,k=k,control=list(seed=1234))
luke_lda_words <- terms(luke_lda,5)
luke_lda_tidy <- tidy(luke_lda)

luke_top_terms <- luke_lda_tidy %>% group_by(topic) %>% top_n(5,beta) %>%
  ungroup() %>% arrange(topic, -beta)

han_clean <- tm_map(han_corpus, removeNumbers)
han_clean <- tm_map(han_clean, removePunctuation)
han_clean <- tm_map(han_clean, stripWhitespace)
han_clean <- tm_map(han_clean, content_transformer(tolower))
han_clean <- tm_map(han_clean, removeWords, sw_stops)

han_dtm <- DocumentTermMatrix(han_clean)
unique_han <- unique(han_dtm$i)
han_dtm <- han_dtm[unique_han,]

han_lda <- LDA(han_dtm,k=k,control=list(seed=1234))
han_lda_words <- terms(han_lda,5)
han_lda_tidy <- tidy(han_lda)

han_top_terms <- han_lda_tidy %>% group_by(topic) %>% top_n(5,beta) %>%
  ungroup() %>% arrange(topic, -beta)

leia_clean <- tm_map(leia_corpus, removeNumbers)
leia_clean <- tm_map(leia_clean, removePunctuation)
leia_clean <- tm_map(leia_clean, stripWhitespace)
leia_clean <- tm_map(leia_clean, content_transformer(tolower))
leia_clean <- tm_map(leia_clean, removeWords, sw_stops)

leia_dtm <- DocumentTermMatrix(leia_clean)
unique_leia <- unique(leia_dtm$i)
leia_dtm <- leia_dtm[unique_leia,]

leia_lda <- LDA(leia_dtm,k=k,control=list(seed=1234))
leia_lda_words <- terms(leia_lda,5)
leia_lda_tidy <- tidy(leia_lda)

leia_top_terms <- leia_lda_tidy %>% group_by(topic) %>% top_n(5,beta) %>%
  ungroup() %>% arrange(topic, -beta)

vader_clean <- tm_map(vader_corpus, removeNumbers)
vader_clean <- tm_map(vader_clean, removePunctuation)
vader_clean <- tm_map(vader_clean, stripWhitespace)
vader_clean <- tm_map(vader_clean, content_transformer(tolower))
vader_clean <- tm_map(vader_clean, removeWords, sw_stops)

vader_dtm <- DocumentTermMatrix(vader_clean)
unique_vader <- unique(vader_dtm$i)
vader_dtm <- vader_dtm[unique_vader,]

vader_lda <- LDA(vader_dtm,k=k,control=list(seed=1234))
vader_lda_words <- terms(vader_lda,5)
vader_lda_tidy <- tidy(vader_lda)

vader_top_terms <- vader_lda_tidy %>% group_by(topic) %>% top_n(5,beta) %>%
  ungroup() %>% arrange(topic, -beta)

threepio_clean <- tm_map(threepio_corpus, removeNumbers)
threepio_clean <- tm_map(threepio_clean, removePunctuation)
threepio_clean <- tm_map(threepio_clean, stripWhitespace)
threepio_clean <- tm_map(threepio_clean, content_transformer(tolower))
threepio_clean <- tm_map(threepio_clean, removeWords, sw_stops)

threepio_dtm <- DocumentTermMatrix(threepio_clean)
unique_threepio <- unique(threepio_dtm$i)
threepio_dtm <- threepio_dtm[unique_threepio,]

threepio_lda <- LDA(threepio_dtm,k=k,control=list(seed=1234))
threepio_lda_words <- terms(threepio_lda,5)
threepio_lda_tidy <- tidy(threepio_lda)

threepio_top_terms <- threepio_lda_tidy %>% group_by(topic) %>% top_n(5,beta) %>%
  ungroup() %>% arrange(topic, -beta)

obiwan_clean <- tm_map(obiwan_corpus, removeNumbers)
obiwan_clean <- tm_map(obiwan_clean, removePunctuation)
obiwan_clean <- tm_map(obiwan_clean, stripWhitespace)
obiwan_clean <- tm_map(obiwan_clean, content_transformer(tolower))
obiwan_clean <- tm_map(obiwan_clean, removeWords, sw_stops)

obiwan_dtm <- DocumentTermMatrix(obiwan_clean)
unique_obiwan <- unique(obiwan_dtm$i)
obiwan_dtm <- obiwan_dtm[unique_obiwan,]

obiwan_lda <- LDA(obiwan_dtm,k=k,control=list(seed=1234))
obiwan_lda_words <- terms(obiwan_lda,5)
obiwan_lda_tidy <- tidy(obiwan_lda)

obiwan_top_terms <- obiwan_lda_tidy %>% group_by(topic) %>% top_n(5,beta) %>%
  ungroup() %>% arrange(topic, -beta)

lando_clean <- tm_map(lando_corpus, removeNumbers)
lando_clean <- tm_map(lando_clean, removePunctuation)
lando_clean <- tm_map(lando_clean, stripWhitespace)
lando_clean <- tm_map(lando_clean, content_transformer(tolower))
lando_clean <- tm_map(lando_clean, removeWords, sw_stops)

lando_dtm <- DocumentTermMatrix(lando_clean)
unique_lando <- unique(lando_dtm$i)
lando_dtm <- lando_dtm[unique_lando,]

lando_lda <- LDA(lando_dtm,k=k,control=list(seed=1234))
lando_lda_words <- terms(lando_lda,5)
lando_lda_tidy <- tidy(lando_lda)

lando_top_terms <- lando_lda_tidy %>% group_by(topic) %>% top_n(5,beta) %>%
  ungroup() %>% arrange(topic, -beta)

#sentiment analysis visualization

sent_viz <- data.frame("character"=c("Luke","Han","Leia","Vader","Threepio",
                                     "Obiwan","Lando"),
                       "score"=c(luke_score, han_score, leia_score,
                                 vader_score, threepio_score, obiwan_score,
                                 lando_score))

ggplot(sent_viz,aes(x=reorder(character,-score),y=score,fill=character)) +
  geom_col(show.legend=FALSE) +
  geom_hline(yintercept=sw_score,col="black",size=1) + theme_fivethirtyeight()

sent_viz$score_norm <- c((luke_score/count(luke_tidy)),
                         (han_score/count(han_tidy)),
                         (leia_score/count(leia_tidy)),
                         (vader_score/count(vader_tidy)),
                         (threepio_score/count(threepio_tidy)),
                         (obiwan_score/count(obiwan_tidy)),
                         (lando_score/count(lando_tidy)))

sw_score_norm <- as.numeric(sw_score/count(sw_tidy))

ggplot(sent_viz,aes(x=reorder(character,-score),y=score_norm,fill=character)) +
  geom_col(show.legend=FALSE) + theme_fivethirtyeight() #+
  geom_hline(yintercept=sw_score_norm,col="black",size=1)

#word frequency visualizations

wordcloud(luke_freq$word,luke_freq$n,scale=c(4,0.001),
          colors=c("green","forestgreen","mediumspringgreen","darkgreen"))
wordcloud(han_freq$word,han_freq$n,scale=c(4,0.001),
          colors=c("slateblue","dodgerblue","darkblue","cornflowerblue"))
wordcloud(leia_freq$word,leia_freq$n,scale=c(4,0.001),
          colors=c("palevioletred","rosybrown","maroon","deeppink"))
wordcloud(vader_freq$word,vader_freq$n,scale=c(4,0.001),
          colors=c("red","coral","salmon","darkred"))
wordcloud(threepio_freq$word,threepio_freq$n,scale=c(4,0.001),
          colors=c("yellow3","goldenrod","burlywood3","darkgoldenrod"))
wordcloud(obiwan_freq$word,obiwan_freq$n,scale=c(4,0.001),
          colors=c("gray","gray31","slategray","grey47"))
wordcloud(lando_freq$word,lando_freq$n,scale=c(4,0.001),
          colors=c("orchid","darkviolet","violet","darkorchid"))

#topic modeling visualizations

sw_final_terms <- sw_top_terms %>% mutate(term=reorder(term,beta)) %>%
  ggplot(aes(term,beta,fill=factor(topic))) + geom_col(show.legend=FALSE) +
  facet_wrap(~topic,scales="free") + coord_flip() + theme_fivethirtyeight()
sw_final_terms

luke_final_terms <- luke_top_terms %>% mutate(term=reorder(term,beta)) %>%
  ggplot(aes(term,beta,fill=factor(topic))) + geom_col(show.legend=FALSE) +
  facet_wrap(~topic,scales="free") + coord_flip() + theme_fivethirtyeight()
luke_final_terms

han_final_terms <- han_top_terms %>% mutate(term=reorder(term,beta)) %>%
  ggplot(aes(term,beta,fill=factor(topic))) + geom_col(show.legend=FALSE) +
  facet_wrap(~topic,scales="free") + coord_flip() + theme_fivethirtyeight()
han_final_terms

leia_final_terms <- leia_top_terms %>% mutate(term=reorder(term,beta)) %>%
  ggplot(aes(term,beta,fill=factor(topic))) + geom_col(show.legend=FALSE) +
  facet_wrap(~topic,scales="free") + coord_flip() + theme_fivethirtyeight()
leia_final_terms

vader_final_terms <- vader_top_terms %>% mutate(term=reorder(term,beta)) %>%
  ggplot(aes(term,beta,fill=factor(topic))) + geom_col(show.legend=FALSE) +
  facet_wrap(~topic,scales="free") + coord_flip() + theme_fivethirtyeight()
vader_final_terms

threepio_final_terms <- threepio_top_terms %>% mutate(term=reorder(term,beta)) %>%
  ggplot(aes(term,beta,fill=factor(topic))) + geom_col(show.legend=FALSE) +
  facet_wrap(~topic,scales="free") + coord_flip() + theme_fivethirtyeight()
threepio_final_terms

obiwan_final_terms <- obiwan_top_terms %>% mutate(term=reorder(term,beta)) %>%
  ggplot(aes(term,beta,fill=factor(topic))) + geom_col(show.legend=FALSE) +
  facet_wrap(~topic,scales="free") + coord_flip() + theme_fivethirtyeight()
obiwan_final_terms

lando_final_terms <- lando_top_terms %>% mutate(term=reorder(term,beta)) %>%
  ggplot(aes(term,beta,fill=factor(topic))) + geom_col(show.legend=FALSE) +
  facet_wrap(~topic,scales="free") + coord_flip() + theme_fivethirtyeight()
lando_final_terms
